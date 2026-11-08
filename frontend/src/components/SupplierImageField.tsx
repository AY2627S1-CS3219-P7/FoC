/**
 * AI Assistance Disclosure
 * Tool: Cursor (Composer)
 * Scope: Optional image URL with pan/zoom crop window; Apply crop stores a framed image.
 * Author review: Frontend-only; blank stays valid. Cropped result is a data URL in image_url.
 */

import { useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Cropper, { type Area } from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import {
  getSupplierImageUrlError,
  isValidSupplierImageUrl,
  normalizeSupplierImageUrl,
} from '../api/suppliers'

type SupplierImageFieldProps = {
  value: string
  onChange: (value: string) => void
  error?: boolean
}

/** Matches SupplierCard / SupplierHeroImage. */
const CROP_ASPECT = 16 / 9

/**
 * Normalized export size — independent of the source image.
 * Keep under ~100kb JSON (cloud gateway may still be on Express default until redeployed).
 */
const OUTPUT_WIDTH = 640
const OUTPUT_HEIGHT = 360
const OUTPUT_QUALITY = 0.65

/** Stay under Express default ~100kb JSON body so cropped saves work without a gateway redeploy. */
const MAX_CROPPED_DATA_URL_CHARS = 70_000

function isCroppedDataUrl(value: string): boolean {
  return value.trim().startsWith('data:image/')
}

async function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', () => reject(new Error('Image failed to load')))
    // Needed for canvas export from many CDNs (imgur, github raw, etc.).
    image.crossOrigin = 'anonymous'
    image.src = url
  })
}

/**
 * Crop → always resize to OUTPUT_WIDTH×OUTPUT_HEIGHT → compressed JPEG data URL.
 * Source resolution/file size does not affect the final payload shape.
 */
async function getNormalizedCropDataUrl(
  imageSrc: string,
  pixelCrop: Area,
): Promise<string> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = OUTPUT_WIDTH
  canvas.height = OUTPUT_HEIGHT

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Could not crop image')
  }

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT)
  context.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    OUTPUT_WIDTH,
    OUTPUT_HEIGHT,
  )

  for (const quality of [OUTPUT_QUALITY, 0.6, 0.48, 0.36]) {
    const dataUrl = canvas.toDataURL('image/jpeg', quality)
    if (dataUrl.length <= MAX_CROPPED_DATA_URL_CHARS) {
      return dataUrl
    }
  }

  const fallback = canvas.toDataURL('image/jpeg', 0.28)
  if (fallback.length > MAX_CROPPED_DATA_URL_CHARS) {
    throw new Error(
      'Could not prepare this crop for upload. Click “Clear crop / change URL” and Save with the original image link instead (crop is optional).',
    )
  }
  return fallback
}

function SupplierImageField({
  value,
  onChange,
  error = false,
}: SupplierImageFieldProps) {
  const [sourceUrl, setSourceUrl] = useState(
    isCroppedDataUrl(value) ? '' : value,
  )
  const [previewFailed, setPreviewFailed] = useState(false)
  const [cropping, setCropping] = useState(false)
  const [cropError, setCropError] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const normalizedSource = normalizeSupplierImageUrl(sourceUrl)
  const canCropSource =
    normalizedSource !== null &&
    isValidSupplierImageUrl(sourceUrl) &&
    !isCroppedDataUrl(sourceUrl) &&
    !previewFailed

  const showingCroppedResult = isCroppedDataUrl(value)

  useEffect(() => {
    setPreviewFailed(false)
    setCropError('')
    setZoom(1)
    setCrop({ x: 0, y: 0 })
    setCroppedAreaPixels(null)
  }, [sourceUrl])

  useEffect(() => {
    if (!isCroppedDataUrl(value) && value !== sourceUrl) {
      setSourceUrl(value)
    }
  }, [value, sourceUrl])

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  async function handleApplyCrop() {
    if (!normalizedSource || !croppedAreaPixels) return
    try {
      setCropping(true)
      setCropError('')
      const dataUrl = await getNormalizedCropDataUrl(
        normalizedSource,
        croppedAreaPixels,
      )
      onChange(dataUrl)
    } catch (cropApplyError) {
      console.error(cropApplyError)
      setCropError(
        cropApplyError instanceof Error
          ? cropApplyError.message
          : 'Could not crop this image (the host may block canvas use). Try another direct image URL.',
      )
    } finally {
      setCropping(false)
    }
  }

  function handleClearCropped() {
    onChange(sourceUrl.trim() ? sourceUrl.trim() : '')
  }

  function handleUrlFieldChange(next: string) {
    setSourceUrl(next)
    // Keep form value in sync for uncropped URLs so submit still works without Apply.
    if (!isCroppedDataUrl(value)) {
      onChange(next)
    }
  }

  return (
    <Box>
      <TextField
        fullWidth
        label="Image URL"
        value={showingCroppedResult ? sourceUrl || 'Cropped image ready' : sourceUrl}
        onChange={(event) => handleUrlFieldChange(event.target.value)}
        disabled={showingCroppedResult}
        error={error}
        helperText={
          error
            ? getSupplierImageUrlError(sourceUrl || value)
            : showingCroppedResult
              ? 'Crop ready locally — click Save Changes to store it. Clear crop to use the original URL instead.'
              : 'Optional. Paste a direct image URL. Crop is optional: frame it, Apply crop, then Save Changes.'
        }
      />

      {showingCroppedResult && (
        <Stack spacing={1} sx={{ mt: 1.5, alignItems: 'flex-start' }}>
          <Typography variant="caption" color="text.secondary">
            Applied crop
          </Typography>
          <Box
            component="img"
            src={value}
            alt="Cropped supplier preview"
            sx={{
              display: 'block',
              width: '100%',
              height: 'auto',
              aspectRatio: `${CROP_ASPECT}`,
              objectFit: 'cover',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'grey.100',
            }}
          />
          <Button type="button" size="small" onClick={handleClearCropped}>
            Clear crop / change URL
          </Button>
        </Stack>
      )}

      {!showingCroppedResult && normalizedSource && (
        <Box sx={{ mt: 1.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
            Fixed 16∶9 frame (same as supplier cards). Drag to move; scroll or pinch to zoom.
          </Typography>
          {canCropSource ? (
            <Stack spacing={1.5}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: `${CROP_ASPECT}`,
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: '#111',
                  border: '1px solid',
                  borderColor: 'divider',
                  touchAction: 'none',
                }}
              >
                <Cropper
                  image={normalizedSource}
                  crop={crop}
                  zoom={zoom}
                  minZoom={1}
                  maxZoom={3}
                  aspect={CROP_ASPECT}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  onMediaLoaded={() => setPreviewFailed(false)}
                  zoomWithScroll
                  showGrid
                />
                <Box
                  component="img"
                  src={normalizedSource}
                  alt=""
                  onError={() => setPreviewFailed(true)}
                  sx={{ display: 'none' }}
                />
              </Box>

              <Button
                type="button"
                variant="outlined"
                onClick={handleApplyCrop}
                disabled={cropping || !croppedAreaPixels}
              >
                {cropping ? 'Applying crop…' : 'Apply crop'}
              </Button>
              <Typography variant="caption" color="text.secondary">
                Apply only prepares the image. You still need Save Changes for it to stick.
              </Typography>
              {cropError && (
                <Typography variant="body2" color="error">
                  {cropError}
                </Typography>
              )}
            </Stack>
          ) : (
            <Box
              sx={{
                display: 'grid',
                placeItems: 'center',
                height: 120,
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider',
                bgcolor: 'action.hover',
                px: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {error || previewFailed
                  ? 'Image could not be loaded. The supplier card will use the type placeholder.'
                  : 'Enter a direct image URL to frame it.'}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default SupplierImageField
