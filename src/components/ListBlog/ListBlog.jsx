import React, { useEffect, useState, useRef } from 'react';
import { message, Button, Input } from 'antd';
import './ListBlog.css';
import upload_area from "/assets/upload_area.svg";

const ListBlog = () => {
    const updateFormRef = useRef(null);
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [image, setImage] = useState(null); // For updated image
    const [video, setVideo] = useState(null); // For updated video
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        simpledescription:'',
        back:'',
        description: { 
            story: '', 
            plusPoint: '', 
            minusPoint: '', 
            technicalAspect: '', 
            finalReview: '' 
        },
        star: '',
        details: { 
            genre: '', 
            createdBy: '', 
            directedBy: '', 
            musicBy: '', 
            countryOfOrigin: '', 
            originalLanguage: '', 
            seasons: '', 
            numberOfEpisodes: '' 
        },
    });

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch('https://moviebackend-o6m5.onrender.com/api/blogs');
                if (!response.ok) {
                    throw new Error('Failed to fetch blogs');
                }
                const data = await response.json();
                setBlogs([...data].reverse());
                setFilteredBlogs(data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        fetchBlogs();
    }, []);


    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter blogs based on the search query
        const filtered = blogs.filter(blog =>
            blog.title.toLowerCase().includes(query)
        );
        setFilteredBlogs(filtered);
    };

    const deleteBlog = async (id) => {
        try {
            const response = await fetch(`https://moviebackend-o6m5.onrender.com/api/blogs/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete blog');
            }
            message.success('Blog deleted successfully');
            setBlogs(blogs.filter(blog => blog._id !== id));
            setFilteredBlogs(filteredBlogs.filter(blog => blog._id !== id));
        } catch (error) {
            console.error('Error deleting blog:', error);
            message.error('Error deleting blog');
        }
    };

    const handleEdit = (blog) => {
        setSelectedBlog(blog);
        setFormData({
            title: blog.title,
            back: blog.back,
            simpledescription : blog.simpledescription,
            category: blog.category,
            description: { ...blog.description },
            star: blog.star,
            details: { ...blog.details },
        });
        setImage(null); 
        setVideo(null); 

        if (updateFormRef.current) {
            updateFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleVideoChange = (e) => {
        setVideo(e.target.files[0]);
    };

    const handleUpdate = async (id) => {
        try {
            const formDataToUpdate = new FormData();

            // Append updated fields
            formDataToUpdate.append("title", formData.title);
            formDataToUpdate.append("category", formData.category);
            formDataToUpdate.append("simpledescription", formData.simpledescription);
            formDataToUpdate.append("back", formData.back);
            formDataToUpdate.append("star", formData.star);

            // Append description fields separately
            for (const key in formData.description) {
                formDataToUpdate.append(`description[${key}]`, formData.description[key]);
            }

            // Append details fields separately
            for (const key in formData.details) {
                formDataToUpdate.append(`details[${key}]`, formData.details[key]);
            }

            // Append image and video if they exist
            if (image) {
                formDataToUpdate.append("img", image);
            }
            if (video) {
                formDataToUpdate.append("video", video);
            }

            const response = await fetch(`https://moviebackend-o6m5.onrender.com/api/blogs/${id}`, {
                method: 'PUT',
                body: formDataToUpdate,
            });

            if (!response.ok) {
                throw new Error('Failed to update blog');
            }
            const updatedBlog = await response.json();
            setBlogs(blogs.map(blog => (blog._id === id ? updatedBlog.blog : blog)));
            setFilteredBlogs(filteredBlogs.map(blog => (blog._id === id ? updatedBlog.blog : blog)));
            message.success('Blog updated successfully');
            setSelectedBlog(null); // Close the modal
        } catch (error) {
            console.error('Error updating blog:', error);
            message.error('Error updating blog');
        }
    };

    return (
        <div className="list-blog">
            <h2>All Blogs</h2>
            <label>Search by movie name :</label>
            <Input
                placeholder="Search by title"
                value={searchQuery}
                onChange={handleSearch}
                style={{ width: '300px', margin: '20px', border: '1px solid' }}
            />
            <div className="blog-list">
                {filteredBlogs.length === 0 ? (
                    <p>No blogs available.</p>
                ) : (
                    filteredBlogs.map((blog) => (
                        <div key={blog._id} className="blog-card">
                            <img src={blog.img} alt="blog-img" className="blog-card-img" />
                            <div className="blog-card-content">
                                <h3 className="blog-card-title">{blog.title}</h3>
                                <p className="blog-card-category">Category : {blog.category}</p>
                                <p className="blog-card-description">Simple Description : {blog.simpledescription}</p>
                                <p className="blog-card-description">youtube link :{blog.back}</p>
                                <p className="blog-card-rating">Rating: {blog.star}</p>
                                <div className="blog-card-details">
                                    <h4>Description</h4>
                                    <p><strong>Story:</strong> {blog.description.story}</p>
                                    <p><strong>Plus Points:</strong> {blog.description.plusPoint}</p>
                                    <p><strong>Minus Points:</strong> {blog.description.minusPoint}</p>
                                    <p><strong>Technical Aspect:</strong> {blog.description.technicalAspect}</p>
                                    <p><strong>Final Review:</strong> {blog.description.finalReview}</p>
                                    
                                    <h4>Genre Details</h4>
                                    <p><strong>Genre:</strong> {blog.details.genre}</p>
                                    <p><strong>Created By:</strong> {blog.details.createdBy}</p>
                                    <p><strong>Directed By:</strong> {blog.details.directedBy}</p>
                                    <p><strong>Music By:</strong> {blog.details.musicBy}</p>
                                    <p><strong>Country:</strong> {blog.details.countryOfOrigin}</p>
                                    <p><strong>Language:</strong> {blog.details.originalLanguage}</p>
                                    <p><strong>Seasons:</strong> {blog.details.seasons}</p>
                                    <p><strong>Episodes:</strong> {blog.details.numberOfEpisodes}</p>
                                </div>
                                <div className="blog-actions">
                                    <Button onClick={() => handleEdit(blog)} type="primary">Edit</Button>
                                    <Button onClick={() => deleteBlog(blog._id)} type="danger">Delete</Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedBlog && (
                <div className="update-form" ref={updateFormRef}>
                    <h3>Edit Blog</h3>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Title"
                    />
                    <label>Category:</label>
                    <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Category"
                    />
                       <label>Simple Description:</label>
                    <textarea style={{width:"100%"}}
                        value={formData.simpledescription}
                        onChange={(e) => setFormData({ ...formData, simpledescription:  e.target.value  })}
                        placeholder="simpledescription"
                    />
                         <label>Youtube Link:</label>
                    <textarea style={{width:"100%"}}
                        value={formData.back}
                        onChange={(e) => setFormData({ ...formData, back:  e.target.value  })}
                        placeholder="youtube link"
                    />
                    <label>Story:</label>
                    <textarea style={{width:"100%"}}
                        value={formData.description.story}
                        onChange={(e) => setFormData({ ...formData, description: { ...formData.description, story: e.target.value } })}
                        placeholder="Story"
                    />
                    <label>Plus Points:</label>
                    <textarea style={{width:"100%"}}
                        value={formData.description.plusPoint}
                        onChange={(e) => setFormData({ ...formData, description: { ...formData.description, plusPoint: e.target.value } })}
                        placeholder="Plus Points"
                    />
                    <label>Minus Points:</label>
                    <textarea style={{width:"100%"}}
                        value={formData.description.minusPoint}
                        onChange={(e) => setFormData({ ...formData, description: { ...formData.description, minusPoint: e.target.value } })}
                        placeholder="Minus Points"
                    />
                    <label>Technical Aspect:</label>
                    <textarea style={{width:"100%"}}
                        value={formData.description.technicalAspect}
                        onChange={(e) => setFormData({ ...formData, description: { ...formData.description, technicalAspect: e.target.value } })}
                        placeholder="Technical Aspect"
                    />
                    <label>Final Review:</label>
                    <textarea style={{width:"100%"}}
                        value={formData.description.finalReview}
                        onChange={(e) => setFormData({ ...formData, description: { ...formData.description, finalReview: e.target.value } })}
                        placeholder="Final Review"
                    />
                    <label>Star Rating:</label>
                    <input
                        type="number"
                        value={formData.star}
                        onChange={(e) => setFormData({ ...formData, star: e.target.value })}
                        placeholder="Star Rating"
                    />
                    <label>Genre:</label>
                    <input
                        type="text"
                        value={formData.details.genre}
                        onChange={(e) => setFormData({ ...formData, details: { ...formData.details, genre: e.target.value } })}
                        placeholder="Genre"
                    />
                    <label>Created By:</label>
                    <input
                        type="text"
                        value={formData.details.createdBy}
                        onChange={(e) => setFormData({ ...formData, details: { ...formData.details, createdBy: e.target.value } })}
                        placeholder="Created By"
                    />
                    <label>Directed By:</label>
                    <input
                        type="text"
                        value={formData.details.directedBy}
                        onChange={(e) => setFormData({ ...formData, details: { ...formData.details, directedBy: e.target.value } })}
                        placeholder="Directed By"
                    />
                    <label>Music By:</label>
                    <input
                        type="text"
                        value={formData.details.musicBy}
                        onChange={(e) => setFormData({ ...formData, details: { ...formData.details, musicBy: e.target.value } })}
                        placeholder="Music By"
                    />
                    <label>Country:</label>
                    <input
                        type="text"
                        value={formData.details.countryOfOrigin}
                        onChange={(e) => setFormData({ ...formData, details: { ...formData.details, countryOfOrigin: e.target.value } })}
                        placeholder="Country of Origin"
                    />
                    <label>Language:</label>
                    <input
                        type="text"
                        value={formData.details.originalLanguage}
                        onChange={(e) => setFormData({ ...formData, details: { ...formData.details, originalLanguage: e.target.value } })}
                        placeholder="Original Language"
                    />
                    <label>Seasons:</label>
                    <input
                        type="text"
                        value={formData.details.seasons}
                        onChange={(e) => setFormData({ ...formData, details: { ...formData.details, seasons: e.target.value } })}
                        placeholder="Number of Seasons"
                    />
                    <label>Episodes:</label>
                    <input
                        type="text"
                        value={formData.details.numberOfEpisodes}
                        onChange={(e) => setFormData({ ...formData, details: { ...formData.details, numberOfEpisodes: e.target.value } })}
                        placeholder="Number of Episodes"
                    />
                    <div>
                     <p>Upload Image</p>
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            alt="upload-img"
            className="addblog-thumbnail-img"
          />
        </label>
        <input
          onChange={handleImageChange}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>

      {/* Video Upload */}
      <div className="add-blog-itemfield">
        <p>Upload Video</p>
        <input
          onChange={ handleVideoChange}
          type="file"
          name="video"
          id="video-input"
        />
      </div>
                    <div className="update-actions">
                        <Button onClick={() => handleUpdate(selectedBlog._id)} type="primary">Update</Button>
                        <Button onClick={() => setSelectedBlog(null)} type="default">Cancel</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListBlog;