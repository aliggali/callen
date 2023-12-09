import React, { useState } from "react";

export const UploadImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("upload", 1);
      formData.append("image", selectedFile);

      fetch("http://spring90.dothome.co.kr/uploadimage.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Image profile uploaded");
          } else {
            alert("Failed to upload image profile");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      alert("Please select an image before uploading.");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>
    </div>
  );
};

export default UploadImage;
