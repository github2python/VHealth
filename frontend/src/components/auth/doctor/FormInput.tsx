import React from "react";
// import styles from "./Signup.module.css";

export const FormInput:React.FC = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
}) => {
  return (
    
     
        <input
          type={type}
          id={id}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          placeholder={placeholder}
          value={value} // Bind value
          onChange={onChange} // Update on change
          aria-label={label}
          required
        />
     
  );
};
