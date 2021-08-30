import { useState, createContext } from "react";

export const DeleteContext = createContext();

function DeleteContextProvider({ children }) {
  const [isActive, setIsActive] = useState(false);

  const toggleActive = () => {
    setIsActive((prevState) => !prevState);
  };

  return (
    <DeleteContext.Provider value={{ isActive, toggleActive }}>
      {children}
    </DeleteContext.Provider>
  );
}

export default DeleteContextProvider;
