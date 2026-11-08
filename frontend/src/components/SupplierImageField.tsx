/**
 * AI Assistance Disclosure
 * Tool: Cursor (Composer)
 * Scope: Optional image URL with pan/zoom crop window; Apply crop stores a framed image.
 * Author review: Frontend-only; blank stays valid. Cropped result is a data URL in image_url.
 */

import { useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Slider from '@mui/material/Slider'
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

async function getCroppedImageDataUrl(
  imageSrc: string,
  pixelCrop: Area,
): Promise<string> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const maxEdge = 900
  const scale = Math.min(1, maxEdge / Math.max(pixelCrop.width, pixelCrop.height))
  const outputWidth = Math.max(1, Math.round(pixelCrop.width * scale))
  const outputHeight = Math.max(1, Math.round(pixelCrop.height * scale))

  canvas.width = outputWidth
  canvas.height = outputHeight

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Could not crop image')
  }

  context.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight,
  )

  return canvas.toDataURL('image/jpeg', 0.85)
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
      const dataUrl = await getCroppedImageDataUrl(
        normalizedSource,
        croppedAreaPixels,
      )
      onChange(dataUrl)
    } catch (cropApplyError) {
      console.error(cropApplyError)
      setCropError(
        'Could not crop this image (the host may block canvas use). Try another direct image URL.',
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
              ? 'Crop applied. Clear crop to paste a new URL or adjust again.'
              : 'Optional. Paste a direct image URL, then drag and zoom the window to frame it.'
        }
      />

      {showingCroppedResult && (
        <Stack spacing={1} sx={{ mt: 1.5, alignItems: 'flex-start' }}>
          <Typography variant="caption" color="text.secondary">
            Cropped preview
          </Typography>
          <Box
            component="img"
            src={value}
            alt="Cropped supplier preview"
            sx={{
              display: 'block',
              width: '100%',
              height: 'auto',
              aspectRatio: '16 / 9',
              objectFit: 'fill',
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
            Frame image — drag to move, zoom to resize
          </Typography>
          {canCropSource ? (
            <Stack spacing={1.5}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: 240, sm: 280 },
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: '#111',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Cropper
                  image={normalizedSource}
                  crop={crop}
                  zoom={zoom}
                  aspect={16 / 9}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  onMediaLoaded={() => setPreviewFailed(false)}
                  showGrid
                />
                {/* Hidden probe for load errors when Cropper cannot surface them. */}
                <Box
                  component="img"
                  src={normalizedSource}
                  alt=""
                  onError={() => setPreviewFailed(true)}
                  sx={{ display: 'none' }}
                />
              </Box>
              <Box sx={{ px: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Zoom
                </Typography>
                <Slider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.05}
                  aria-label="Zoom image"
                  onChange={(_event, next) => setZoom(Number(next))}
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
