import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useContentStore } from '../store/contentStore'
import { executeQuery } from '../api/graphql'
import '../App.css'

const CREATE_CONTENT = `
  mutation CreateContent($title: String!, $slug: String!, $body: String!, $authorId: String!, $description: String, $categoryId: String) {
    createContent(title: $title, slug: $slug, body: $body, authorId: $authorId, description: $description, categoryId: $categoryId) {
      id
      title
      slug
      status
    }
  }
`

const GET_CONTENTS = `
  query GetContents {
    getContents {
      id
      title
      slug
      body
      status
      createdAt
    }
  }
`

export default function ContentManager() {
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const { contents, setContents, loading, setLoading } = useContentStore()
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    body: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchContents()
  }, [token])

  const fetchContents = async () => {
    setLoading(true)
    try {
      const data = await executeQuery(GET_CONTENTS)
      setContents(data.getContents || [])
    } catch (err) {
      console.error('Failed to fetch contents:', err)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  const handleTitleChange = (e) => {
    const title = e.target.value
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.title || !formData.slug || !formData.body) {
      setError('Please fill in all required fields')
      return
    }

    try {
      await executeQuery(CREATE_CONTENT, {
        ...formData,
        authorId: user?.id || 'default-user'
      })
      setSuccess('Content created successfully!')
      setFormData({ title: '', slug: '', description: '', body: '' })
      fetchContents()
    } catch (err) {
      setError(err.message || 'Failed to create content')
    }
  }

  return (
    <div>
      <nav className="navbar">
        <h1>Content Manager</h1>
        <div>
          <a href="#" onClick={() => navigate('/dashboard')}>Dashboard</a>
          <a href="#" onClick={() => navigate('/dashboard')}>Logout</a>
        </div>
      </nav>
      
      <div className="container">
        <div className="form-container">
          <h2>Create New Content</h2>
          
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter content title"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="Auto-generated slug"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short description"
              />
            </div>
            
            <div className="form-group">
              <label>Content Body *</label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleChange}
                placeholder="Write your content here..."
                rows="10"
                required
                style={{ minHeight: '200px' }}
              />
            </div>
            
            <button type="submit">Create Content</button>
          </form>
        </div>
        
        <div style={{ marginTop: '3rem' }}>
          <h3>Your Contents</h3>
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
            <p>No contents yet. Create your first content above!</p>
          )}
        </div>
      </div>
    </div>
  )
}
