import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useContentStore } from '../store/contentStore'
import { executeQuery } from '../api/graphql'
import '../App.css'

const GET_CONTENTS = `
  query GetContents($status: String) {
    getContents(status: $status) {
      id
      title
      slug
      status
      createdAt
    }
  }
`

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout, token } = useAuthStore()
  const { contents, setContents, loading, setLoading } = useContentStore()
  const [filter, setFilter] = useState('published')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    
    fetchContents()
  }, [token, filter])

  const fetchContents = async () => {
    setLoading(true)
    try {
      const data = await executeQuery(GET_CONTENTS, { status: filter })
      setContents(data.getContents || [])
    } catch (err) {
      console.error('Failed to fetch contents:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div>
      <nav className="navbar">
        <h1>CMS Dashboard</h1>
        <div>
          <a href="#" onClick={() => navigate('/content-manager')}>Content Manager</a>
          <a href="#" onClick={handleLogout}>Logout</a>
        </div>
      </nav>
      
      <div className="container">
        <h2>Welcome, {user?.username || 'User'}!</h2>
        <p>Manage your content efficiently.</p>
        
        <div style={{ marginTop: '2rem' }}>
          <h3>Published Contents</h3>
          <button onClick={() => navigate('/content-manager')} className="btn-primary">
            + Create New Content
          </button>
          
          {loading ? (
            <p>Loading...</p>
          ) : contents.length > 0 ? (
            <table className="content-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contents.map((content) => (
                  <tr key={content.id}>
                    <td>{content.title}</td>
                    <td>{content.slug}</td>
                    <td>{content.status}</td>
                    <td>{new Date(content.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn-small btn-primary">Edit</button>
                      <button className="btn-small btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No contents found. <a href="#" onClick={() => navigate('/content-manager')}>Create one now!</a></p>
          )}
        </div>
      </div>
    </div>
  )
}
