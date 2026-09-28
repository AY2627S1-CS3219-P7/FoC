/**
 * AI Assistance Disclosure
 * Tool: Cursor (GPT-5.6 Sol Medium)
 * Scope: Assisted with frontend implementation, debugging and UI refinement.
 * Author review: The generated code was reviewed, tested, and iteratively refined by the author through follow-up instructions.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, TextField } from '@mui/material'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from 'react-leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import { kentRidgeCentre, nusLocations, type NusLocation } from '../data/nusLocations'
import { sampleSuppliers } from '../pages/SupplierListPage'

const campusZoom = 15
const searchZoom = 16

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

type MapPoint = NusLocation & {
  kind: 'place' | 'supplier'
}

function supplierPoints(): MapPoint[] {
  return sampleSuppliers.flatMap((supplier, index) => {
    const match = nusLocations.find(
      (place) => place.name.toLowerCase() === supplier.location.toLowerCase(),
    )
    if (!match) {
      return []
    }

    const shift = (index % 3) * 0.00015
    return [
      {
        id: `supplier-${supplier.id}`,
        name: supplier.name,
        detail: `${supplier.type} at ${supplier.location}${
          supplier.operatingHours ? `. ${supplier.operatingHours}` : ''
        }`,
        latitude: match.latitude + shift,
        longitude: match.longitude + shift,
        kind: 'supplier' as const,
      },
    ]
  })
}

function matchesQuery(point: MapPoint, query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) {
    return true
  }

  const haystack = `${point.name} ${point.detail}`.toLowerCase()
  return haystack.includes(needle)
}

function MapCamera({
  focus,
  resetToken,
}: {
  focus: MapPoint | null
  resetToken: number
}) {
  const map = useMap()
  const previousReset = useRef(resetToken)

  useEffect(() => {
    if (resetToken !== previousReset.current) {
      previousReset.current = resetToken
      map.fitBounds(
        L.latLngBounds(nusLocations.map((place) => [place.latitude, place.longitude])),
        { paddingTopLeft: [24, 56], paddingBottomRight: [24, 28], maxZoom: campusZoom },
      )
      return
    }

    if (!focus) {
      return
    }

    map.flyTo([focus.latitude, focus.longitude], searchZoom)
  }, [focus, map, resetToken])

  return null
}

function BackToCampus({ onReset }: { onReset: () => void }) {
  const map = useMap()
  const onResetRef = useRef(onReset)

  useEffect(() => {
    onResetRef.current = onReset
  }, [onReset])

  useEffect(() => {
    const Control = L.Control.extend({
      onAdd() {
        const container = L.DomUtil.create('div', '')
        const button = L.DomUtil.create('button', '', container) as HTMLButtonElement
        button.type = 'button'
        button.title = 'Back to campus'
        button.textContent = 'Back to campus'
        button.style.display = 'inline-block'
        button.style.width = 'auto'
        button.style.height = '34px'
        button.style.lineHeight = '34px'
        button.style.padding = '0 12px'
        button.style.borderRadius = '8px'
        button.style.fontWeight = '700'
        button.style.setProperty('color', '#ffffff', 'important')
        button.style.setProperty('background', '#1F8A80', 'important')
        button.style.setProperty('background-color', '#1F8A80', 'important')
        button.style.setProperty('text-decoration', 'none', 'important')
        button.style.setProperty('border', '0', 'important')
        button.style.cursor = 'pointer'
        button.style.boxShadow = '0 2px 8px rgba(20, 94, 89, 0.35)'
        L.DomEvent.disableClickPropagation(container)
        L.DomEvent.on(button, 'click', (event) => {
          L.DomEvent.preventDefault(event)
          L.DomEvent.stop(event)
          onResetRef.current()
        })
        return container
      },
    })
    const control = new Control({ position: 'topleft' })
    control.addTo(map)
    return () => {
      control.remove()
    }
  }, [map])

  return null
}

function LocationMarker({ point }: { point: MapPoint }) {
  return (
    <Marker position={[point.latitude, point.longitude]} icon={defaultIcon}>
      <Popup>
        <strong>{point.name}</strong>
        <br />
        {point.detail}
      </Popup>
    </Marker>
  )
}

function CampusMap() {
  const [query, setQuery] = useState('')
  const [focus, setFocus] = useState<MapPoint | null>(null)
  const [resetToken, setResetToken] = useState(0)
  const places = useMemo(
    () => nusLocations.map((place) => ({ ...place, kind: 'place' as const })),
    [],
  )
  const suppliers = useMemo(() => supplierPoints(), [])
  const visiblePlaces = places.filter((place) => matchesQuery(place, query))
  const visibleSuppliers = suppliers.filter((supplier) => matchesQuery(supplier, query))

  function resetCampusView() {
    setResetToken((token) => token + 1)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%' }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search a store or NUS place"
        value={query}
        onChange={(event) => {
          const nextQuery = event.target.value
          setQuery(nextQuery)
          const match = [...places, ...suppliers].find((point) => matchesQuery(point, nextQuery))
          setFocus(match && nextQuery.trim() ? match : null)
        }}
        slotProps={{ htmlInput: { 'aria-label': 'Search a store or NUS place' } }}
        sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
      />
      <Box
        sx={{
          height: { xs: 360, md: 520 },
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          '& .leaflet-container': { height: '100%', width: '100%', fontFamily: 'inherit' },
        }}
      >
        <MapContainer
          center={[kentRidgeCentre.latitude, kentRidgeCentre.longitude]}
          zoom={campusZoom}
          minZoom={12}
          maxZoom={19}
          scrollWheelZoom
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <ZoomControl position="topright" />
          <BackToCampus onReset={resetCampusView} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          <MapCamera focus={focus} resetToken={resetToken} />
          {visiblePlaces.map((place) => (
            <LocationMarker key={`${place.id}-pin`} point={place} />
          ))}
          {visibleSuppliers.map((supplier) => (
            <LocationMarker key={`${supplier.id}-pin`} point={supplier} />
          ))}
        </MapContainer>
      </Box>
    </Box>
  )
}

export default CampusMap
