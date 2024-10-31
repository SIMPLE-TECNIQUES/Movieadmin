import React, { useState } from "react";
import "./AddBlog.css";
import upload_area from "/assets/upload_area.svg";
import { message } from "antd";

const AddBlog = () => {
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [blogDetails, setBlogDetails] = useState({
    title: "",
    category: "",
    simpledescription:"",
    back:"",
    description: {
      story: "",
      plusPoint: "",
      minusPoint: "",
      technicalAspect: "",
      finalReview: "",
    },
    star: "",
    details: {
      genre: "",
      createdBy: "",
      directedBy: "",
      starring: [],
      musicBy: "",
      countryOfOrigin: "",
      originalLanguage: "",
      seasons: 0,
      numberOfEpisodes: 0,
    },
  });

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleVideo = (e) => {
    setVideo(e.target.files[0]);
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setBlogDetails({
      ...blogDetails,
      [name]: value,
    });
  };

  const handleDescriptionChange = (e) => {
    const { name, value } = e.target;
    setBlogDetails({
      ...blogDetails,
      description: {
        ...blogDetails.description,
        [name]: value,
      },
    });
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setBlogDetails({
      ...blogDetails,
      details: {
        ...blogDetails.details,
        [name]: value,
      },
    });
  };

  const handleStarringChange = (e) => {
    const { value } = e.target;
    setBlogDetails({
      ...blogDetails,
      details: {
        ...blogDetails.details,
        starring: value.split(",").map((item) => item.trim()),
      },
    });
  };

  const isFormValid = () => {
    const { details } = blogDetails;
    return (
      details.genre &&
      details.createdBy &&
      details.directedBy &&
      details.musicBy &&
      details.countryOfOrigin &&
      details.originalLanguage
    );
  };

  const AddNewBlog = async () => {
    if (!isFormValid()) {
      message.error("Please fill all required fields in details.");
      return;
    }

    const formData = new FormData();
    formData.append("img", image);
    formData.append("video", video);

    // Append blog details to formData
    formData.append("title", blogDetails.title);
    formData.append("simpledescription", blogDetails.simpledescription);
    formData.append("back", blogDetails.back);
    formData.append("category", blogDetails.category);
    formData.append("star", blogDetails.star);

    // Append description fields separately
    for (const key in blogDetails.description) {
      formData.append(`description[${key}]`, blogDetails.description[key]);
    }

    // Append details fields separately
    for (const key in blogDetails.details) {
      if (Array.isArray(blogDetails.details[key])) {
        formData.append(`details[${key}]`, blogDetails.details[key].join(",")); // Join array as a comma-separated string
      } else {
        formData.append(`details[${key}]`, blogDetails.details[key]);
      }
    }

    try {
      const response = await fetch("https://moviebackend-o6m5.onrender.com/api/blogs", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        message.success("Blog Added Successfully");
        // Reset the form after successful submission
        setImage(null);
        setVideo(null);
        setBlogDetails({
          title: "",
          category: "",
          simpledescription:"",
          back:"",
          description: {
            descriptiontitle : "",
            story: "",
            plusPoint: "",
            minusPoint: "",
            technicalAspect: "",
            finalReview: "",
          },
          star: "",
          details: {
            genre: "",
            createdBy: "",
            directedBy: "",
            starring: [],
            musicBy: "",
            countryOfOrigin: "",
            originalLanguage: "",
            seasons: 0,
            numberOfEpisodes: 0,
          },
        });
      } else {
        const errorData = await response.json();
        message.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Error adding blog");
    }
  };

  return (
    <div className="add-blog">
      <h2>Add New Blog</h2>
      {/* Blog Title */}
      <div className="add-blog-itemfield">
        <p>Blog Title</p>
        <input
          value={blogDetails.title}
          onChange={changeHandler}
          type="text"
          name="title"
          placeholder="Enter blog title"
        />
      </div>

      {/* Blog Category */}
      <div className="add-blog-itemfield">
        <p>Blog Category</p>
        <select
          value={blogDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-blog-selector"
        >
          <option value="Hollywood">Hollywood</option>
          <option value="Tollywood">Tollywood</option>
          <option value="Bollywood">Bollywood</option>
          <option value="Kollywood">Kollywood</option>
          <option value="Trending">Trending</option>
          <option value="tamilDub">TamilDub</option>
        </select>
      </div>

      {/* Star Rating */}
      <div className="add-blog-itemfield">
        <p>Star Rating</p>
        <input
          value={blogDetails.star}
          onChange={changeHandler}
          type="number"
          name="star"
          placeholder="Enter star rating"
          min="1"
          max="5"
        />
      </div>


      <div className="add-blog-itemfield">
        <p>Simple Description</p>
        <input
          value={blogDetails.simpledescription}
          onChange={changeHandler}
          type="text"
          name="simpledescription"
          placeholder="Enter simple description.."
        />
      </div>

      <div className="add-blog-itemfield">
        <p>Enter the youtube link</p>
        <input
          value={blogDetails.back}
          onChange={changeHandler}
          type="text"
          name="back"
          placeholder="enter the youtube link..."
        />
      </div>

      {/* Description Fields */}
      <div className="add-blog-description">
        <h3>Description</h3>
        {[
          "descriptiontitle",
          "story",
          "plusPoint",
          "minusPoint",
          "technicalAspect",
          "finalReview",
        ].map((field) => (
          <div className="add-blog-itemfield" key={field}>
            <p>{field.charAt(0).toUpperCase() + field.slice(1)}</p>
            <textarea
              value={blogDetails.description[field]}
              onChange={handleDescriptionChange}
              name={field}
              placeholder={`Write the ${field}`}
            />
          </div>
        ))}
      </div>

      {/* Details Fields */}
      <div className="add-blog-details">
        <h3>Details</h3>
        {[
          "genre",
          "createdBy",
          "directedBy",
          "musicBy",
          "countryOfOrigin",
          "originalLanguage",
        ].map((field) => (
          <div className="add-blog-itemfield" key={field}>
            <p>{field.charAt(0).toUpperCase() + field.slice(1)}</p>
            <input
              value={blogDetails.details[field]}
              onChange={handleDetailsChange}
              type="text"
              name={field}
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}
        <div className="add-blog-itemfield">
          <p>Starring</p>
          <input
            value={blogDetails.details.starring.join(", ")} // Show comma-separated values
            onChange={handleStarringChange}
            type="text"
            name="starring"
            placeholder="Enter starring (comma separated)"
          />
        </div>
        <div className="add-blog-itemfield">
          <p>Seasons</p>
          <input
            value={blogDetails.details.seasons}
            onChange={handleDetailsChange}
            type="number"
            name="seasons"
            placeholder="Enter number of seasons"
            min="0"
          />
        </div>
        <div className="add-blog-itemfield">
          <p>Number of Episodes</p>
          <input
            value={blogDetails.details.numberOfEpisodes}
            onChange={handleDetailsChange}
            type="number"
            name="numberOfEpisodes"
            placeholder="Enter number of episodes"
            min="0"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="add-blog-itemfield">
        <p>Card Image</p>
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            alt="upload-img"
            className="addblog-thumbnail-img"
          />
        </label>
        <input
          onChange={handleImage}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>

      {/* Video Upload */}
      <div className="add-blog-itemfield">
        <p>Thumbnail..</p>
        <input
          onChange={handleVideo}
          type="file"
          name="video"
          id="video-input"
        />
      </div>

      {/* Submit Button */}
      <button onClick={AddNewBlog} className="add-blog-btn">
        ADD BLOG
      </button>
    </div>
  );
};

export default AddBlog;
