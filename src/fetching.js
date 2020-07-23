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
      error: false
    }
  )

  useEffect(
    () => {
      const fetchJobs = async (params, page) => {

        dispatch({type: 'MAKE_REQUEST'})

        try {
          const result = await axios.get(
            API_ENDPOINT,
            { 
              params:
                {
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
          dispatch({type: 'ERROR_REQUEST'})
          console.error(error)
        }
      }
      fetchJobs(params, page)
    },
    [params, page]
  )

  return state
}

export default useFetchJobs