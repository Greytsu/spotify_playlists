import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Loader from '../components/loader'
import styled from 'styled-components'
import Track from '../components/track'

const PlaylistDetails = props => {
  const { id } = useParams()
  const [token, setToken] = useState(
    localStorage.getItem('access_token')
      ? localStorage.getItem('access_token')
      : ''
  )
  const [isLoading, setIsLoading] = useState(true)
  const [playlistDetails, setPlaylistDetails] = useState(null)
  const [error, setError] = useState(false)
  const [tracks, setTracks] = useState({})
  const PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/`
  const disconnect = () => {
    props.setLoggedIn(false)
  }
  if (!props.loggedIn) {
    history.push('/')
  }

  //Redirect to login if token empty
  useEffect(() => {
    if (token === '') {
      history.push('/')
    }
  }, [])

  //Token
  useEffect(() => {
    if (token != '') {
      getPlaylist()
    }
  }, [token])

  //Param ID
  useEffect(() => {}, [id])

  //Loader wait for data
  useEffect(() => {
    if (playlistDetails != null) {
      setIsLoading(false)
    }
  }, [playlistDetails])

  const getPlaylist = () => {
    axios
      .get(PLAYLIST_ENDPOINT + id, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      .then(response => {
        setPlaylistDetails(response.data)
        setTracks(response.data.tracks.items)
      })
      .catch(err => {
        setIsLoading(false)
        setError(true)
      })
  }

  //Page content----------------------------------------------------------------

  //Loader
  if (isLoading) {
    return <Loader />
  }

  //Error
  if (error) {
    return (
      <div>
        <p>Error</p>
        <button onClick={getPlaylist()}>Réessayer</button>
        <button onClick={disconnect()}>Se reconnecter</button>
      </div>
    )
  }

  //If no data
  if (!isLoading && playlistDetails == null) {
    return (
      <div>
        <p>ERROR</p>
        <button onClick={getPlaylist()}>Réessayer</button>
      </div>
    )
  }

  //Playlist
  return (
    <PlaylistContainer>
      <PlaylistHeader>
        <Cover src={playlistDetails?.images[0]?.url} />
        <PlaylistDescription>
          <PlaylistTitle>{playlistDetails.name}</PlaylistTitle>
          <PlaylistOwner>{playlistDetails.owner.display_name}</PlaylistOwner>
        </PlaylistDescription>
      </PlaylistHeader>

      <iframe
        src={'https://open.spotify.com/embed/playlist/' + id}
        width='100%'
        height='80'
        frameBorder='0'
        allowtransparency='true'
        allow='encrypted-media'
      ></iframe>

      <TracksContainer>
        {tracks.map(track => {
          return <Track track={track.track} />
        })}
      </TracksContainer>
    </PlaylistContainer>
  )
}

//Style-------------------------------------------------------------------------

const PlaylistContainer = styled.div`
  padding-bottom: 5.5rem;
`

const PlaylistHeader = styled.div`
  display: flex;
  height: 10rem;
  padding-bottom: 1rem;
`

const Cover = styled.img`
  height: 10rem;
  width: 10rem;
  object-fit: cover;
`
const PlaylistDescription = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
`
const PlaylistTitle = styled.p`
  font-weight: bold;
  font-size: 2em;
  margin: 5px;
`

const PlaylistOwner = styled.p`
  font-weight: normal;
  font-size: 1em;
  margin: 5px;
  padding: 2px;
`

const TracksContainer = styled.div`
  display: flex;
  flex-direction: column;
`
export default PlaylistDetails
