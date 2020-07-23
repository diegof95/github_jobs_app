import { useReducer, useEffect } from 'react'
import axios from 'axios'

const PROXY = 'https://cors-anywhere.herokuapp.com/'
const API_ENDPOINT = PROXY + 'https://jobs.github.com/positions.json?'

function jobsReducer(state, action){
  
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
        jobs: action.payload.jobs,
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
    
    case 'UPDATE_HAS_NEXT_PAGE':
      return {
        ...state,
        hasNextPage: action.payload.hasNextPage
      }
    
    default:
      return state
  }
}

function useFetchJobs(params, page){
  
  const [state, dispatch] = useReducer(
    jobsReducer,
    {
      jobs: [],
      loading: false,
      error: false,
      hasNextPage: false
    }
  )

  useEffect(
    () => {

      const cancelToken = axios.CancelToken.source()
      const dummyCancelToken = axios.CancelToken.source()

      const fetchJobs = async (params, page) => {

        dispatch({type: 'MAKE_REQUEST'})
        
        try {
          const result = await axios.get(
            API_ENDPOINT,
            { 
              cancelToken: cancelToken.token,
              params: {
                page: page,
                ...params
              }
            }
          )
        
          dispatch({
            type: 'SUCCESS_REQUEST',
            payload: { jobs: result.data },
          })
        }
        catch(error) {
          if (axios.isCancel(error)) return
          
          dispatch({type: 'ERROR_REQUEST'})
          console.error(error)
        }

        try {
          const dummyResult = await axios.get(
            API_ENDPOINT,
            { 
              cancelToken: dummyCancelToken.token,
              params:
                {
                  page: page + 1,
                  ...params
                }
            }
          )
        
          dispatch({
            type: 'UPDATE_HAS_NEXT_PAGE',
            payload: { hasNextPage: dummyResult.data.length !== 0 },
          })
        }
        catch(error) {
          dispatch({type: 'ERROR_REQUEST'})
          console.error(error)
        }
      }

      fetchJobs(params, page)

      return () => {
        cancelToken.cancel()
        dummyCancelToken.cancel()
      }
    },
    [params, page]
  )

  return state
}

export default useFetchJobs