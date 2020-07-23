import React, {useState} from 'react'
import { Container } from 'react-bootstrap'
import Job from './Job'
import SearchForm from './SearchForm'
import JobsPagination from './Pagination'
import useFetchJobs from './fetching'
//import './App.css'
import 'regenerator-runtime/runtime' // Temp fix to: ReferenceError: regeneratorRuntime is not defined

function App(props){

  const [params, setParams] = useState(
    {
      description: '',
      location: '',
      full_time: ''
    }
  )
  const [page, setPage] = useState(1)
  const { jobs, loading, error, hasNextPage } = useFetchJobs(params, page)

  const handleParamChange = (event) => {
    const param = event.target.name
    const value = event.target.value
    setPage(1)
    setParams( (prevParams) => {
      return { ...prevParams, [param]: value }
    })
  }

  return (
    <Container className="my-4">
      <h1 className="mb-4">GitHub Jobs</h1>
      <SearchForm params={params} onParamChange={handleParamChange} />
      <JobsPagination
        page={page}
        setPage={setPage}
        hasNextPage={hasNextPage}
      />
      {loading && <h1>Loading...</h1>}
      {error && <h1>Error. Try Refreshing.</h1>}
      {jobs.map((job) => {
        return <Job key={job.id} job={job} />
      })}
      <JobsPagination
        page={page}
        setPage={setPage}
        hasNextPage={hasNextPage}
      />
    </Container>
  )
}

export default App