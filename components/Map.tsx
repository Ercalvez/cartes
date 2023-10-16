'use client'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { GeoJSON, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { MapSizer } from './conversation/VoyageUI'
import { decode } from './valhalla-decode-shape'

const center = [47.033, 2.395]

const MapBoxToken =
	'pk.eyJ1Ijoia29udCIsImEiOiJjbGY0NWlldmUwejR6M3hyMG43YmtkOXk0In0.08u_tkAXPHwikUvd2pGUtw'

const buildGeoJSON = (coordinates) => ({
	type: 'FeatureCollection',
	features: [
		{
			type: 'Feature',
			properties: {},
			geometry: {
				coordinates,
				type: 'LineString',
			},
		},
	],
})

const reverse = (array) => array.slice().reverse()

const Map = ({ origin, destination, setRealDistance, orthodromic }) => {
	const [trip, setTrip] = useState(null)

	const shape = trip && trip.legs[0].shape
	const decoded = shape && decode(shape)
	const geoJSON = orthodromic
		? origin &&
		  destination &&
		  buildGeoJSON([reverse(origin), reverse(destination)])
		: trip && buildGeoJSON(decoded)

	const points = geoJSON && geoJSON.features[0].geometry.coordinates,
		geoCenter = points && points[0].slice().reverse()

	useEffect(() => {
		if (!origin || !destination) return
		if (orthodromic) return
		const params = {
			costing: 'auto',
			exclude_polygons: [],
			locations: [
				{ lon: origin[1], lat: origin[0], type: 'break' },
				{ lon: destination[1], lat: destination[0], type: 'break' },
			],
			directions_options: { units: 'kilometers' },
			id: 'valhalla_directions',
		}
		const url = `https://valhalla1.openstreetmap.de/route?json=${JSON.stringify(
			params
		)}`
		fetch(url)
			.then((res) => res.json())

			.then((json) => {
				console.log('TRIP', json.trip)

				const distance = Math.round(json.trip.summary.length)
				console.log('distance', distance)
				const manoeuvers = json.trip.legs[0].maneuvers,
					paidHighwaySegments = manoeuvers.filter(
						(segment) => segment.highway && segment.toll
					),
					paidDistance = paidHighwaySegments.reduce(
						(memo, next) => next.length + memo,
						0
					),
					highwayLengthMap = paidHighwaySegments.map(
						({ street_names, length }) => [
							street_names.join(' + '),
							length + ' km',
						]
					)

				console.log({ paidHighwaySegments, paidDistance, highwayLengthMap })
				const price = paidHighwaySegments.map((segment) =>
					segment.street_names.find((street) => street)
				)

				setRealDistance(distance)

				setTrip(json.trip)
			})
	}, [origin, destination])
	return (
		<MapSizer>
			<MapContainer
				center={geoCenter || center}
				zoom={4.5}
				zoomSnap={0.3}
				zoomControl={false}
			>
				{points && (
					<MapZoomer points={points.map((el) => el.slice().reverse())} />
				)}
				<TileLayer
					url={`https://api.mapbox.com/styles/v1/kont/clnbjtwzv03jw01qu1jhp9soj/tiles/{z}/{x}/{y}?access_token=${MapBoxToken}`}
				/>

				{origin && <Marker position={origin}></Marker>}
				{destination && <Marker position={destination}></Marker>}
				{geoJSON && (
					<GeoJSON
						data={geoJSON}
						color={'var(--color)'}
						weight={6}
						key={JSON.stringify(geoJSON)}
					/>
				)}
			</MapContainer>
		</MapSizer>
	)
}

export default Map

function MapZoomer({ points }) {
	const map = useMap()
	useEffect(() => {
		var bounds = new L.LatLngBounds(points)
		map.fitBounds(bounds, { padding: [40, 40] })
	}, [points])
}
