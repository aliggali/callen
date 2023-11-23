import React, { useState, useEffect } from "react";

export const Loadimage = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Fetch data from the server
    fetch("http://spring90.dothome.co.kr/loadimage.php")
      .then((response) => response.json())
      .then((data) => {
        // Check if the request was successful
        if (data.success) {
          setImages(data.images);
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <center>
      <table>
        <thead>
          <tr>
            <th>IMAGE</th>
          </tr>
        </thead>
        <tbody>
          {images.map((image, index) => (
            <tr key={index}>
              <td>
                <img
                  src={`data:image;base64,${image}`}
                  alt={`Image ${index}`}
                  style={{ width: "100px", height: "100px" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </center>
  );
};

export default Loadimage;
