import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>Profile Page</h2>
      <p>Client ID: {id}</p>
    </div>
  );
};

export default Profile;
