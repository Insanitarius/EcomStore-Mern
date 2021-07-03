import React from "react";
import { API } from "../../backend";

const ImageHelper = ({ product }) => {
  const imageUrl = product
    ? `${API}/product/photo/${product._id}`
    : `https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`;
  return (
    <div className="rounded border border-success p-2">
      <img
        src={imageUrl}
        alt=""
        style={{ maxHeight: "300px", maxWidth: "350px" }}
        className="mb-2 mt-2 rounded"
      />
    </div>
  );
};

export default ImageHelper;
