import { useReducer, useEffect } from 'react'
import axios from 'axios'

const API_ENDPOINT = 'https://jobs.github.com/positions.json?'

function reducer(state, action){
  switch(action.type){
    case 'MAKE_REQUEST':
      return {
        ...state,
        jobs: [],
        loading: true,
        error: false
      }
    case 'SUCCESS_REQUEST':
      return {
        ...state,
        jobs: action.payload,
        loading: false,
        error: false
      }

    case 'ERROR_REQUEST':
      return {
        ...state,
        jobs: [],
        loading: false,
        error: true
      }
    default:
      return state
  }
}

function useFetchJobs(params, page){
  
  const [state, dispatch] = useReducer(
    reducer,
    {
      jobs: [],
      loading: false,
      error: false
    }
  )

  useEffect(() => {
    const fetchJobs = async (params, page) => {

      dispatchStories({type: 'MAKE_REQUEST'})

      const result = await axios.get(
        API_ENDPOINT,
        {
          ...params,
          page: page,
        }
      )

      try {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.data,
        })
      }
      catch {
        dispatchStories({type: 'STORIES_FETCH_ERROR'})
      }
    }
    fetchJobs()
  },
  [params, page]
  )

  return state
}

export default useFetchJobs