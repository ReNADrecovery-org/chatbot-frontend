import { useEffect, useState } from "react";
import axios from "axios";
import { environment } from "environment";

const Train = () => {
  const BASE_URL = environment.BASE_URL;
  const [files, setFiles] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [namespace, setNamespace] = useState("General");

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("length", files.length);
    formData.append("namespace", namespace);
    console.log(namespace);

    files.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

    try {
      console.log(formData);
      setIsTraining(true); // Set loading indicator to true
      const response = await axios.post(
        `${BASE_URL}/v2/upload_documents/`,
        formData
      );
      console.log(response.status);
      if (response.data.status === "success") {
        alert("Training completed");
      } else {
        alert("there was an error");
      }

      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTraining(false); // Set loading indicator back to false
    }
  };

  return (
    <div>
      <div className="upload-container">
        <form onSubmit={handleUpload}>
          <label className="custom-file-upload">
            Choose Files
            <i className="fa fa-upload"></i>
            <input type="file" multiple onChange={handleChange} />
          </label>
          <select onChange={(e) => setNamespace(e.target.value)}>
            <option>General</option>
            <option>Aetna</option>
            <option>Cigna</option>
            <option>Humana</option>
            <option>Medicare</option>
            <option>BCBS/California</option>
            <option>BCBS/Colorado</option>
            <option>BCBS/Connecticut</option>
            <option>BCBS/Georgia</option>
            <option>BCBS/Illinois</option>
            <option>BCBS/Indiana</option>
            <option>BCBS/Kentucky</option>
            <option>BCBS/Maine</option>
            <option>BCBS/Massachusetts</option>
            <option>BCBS/Missouri</option>
            <option>BCBS/Nevada</option>
            <option>BCBS/NewYork</option>
            <option>BCBS/Ohio</option>
            <option>BCBS/Virginia</option>
            <option>BCBS/Wisconsin</option>
          </select>
          <button type="submit" disabled={isTraining}>
            {isTraining ? "Training in progress..." : "Train"}
          </button>
        </form>
      </div>
      {isTraining && <p>Training in progress. Please wait ...</p>}
    </div>
  );
};
export default Train;
