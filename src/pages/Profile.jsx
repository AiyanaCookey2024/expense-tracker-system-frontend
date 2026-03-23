import { useEffect, useState } from "react";
import { uploadImageToCloudinary } from "../utils/cloudinary";

function Profile() {
  const apiURL = import.meta.env.VITE_DJANGO_API_URL || "http://127.0.0.1:8001";

  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    fetch(`${apiURL}/api/auth/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setEmail(data.email || "");
      })
      .catch((err) => console.error(err));
  }, [apiURL]);

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) return;

    setLoading(true);

    try {
      let imageUrl = profile?.image_url || "";
      let imagePublicId = profile?.image_public_id || "";

      if (selectedFile) {
        const uploadResult = await uploadImageToCloudinary(selectedFile);
        imageUrl = uploadResult.imageUrl;
        imagePublicId = uploadResult.publicId;
      }

      const res = await fetch(`${apiURL}/api/auth/profile/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          image_url: imageUrl,
          image_public_id: imagePublicId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update profile");
        return;
      }

      setProfile(data);
      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while updating profile");
    } finally {
      setLoading(false);
    }
  }

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="container">
      <h1>Profile</h1>

      <form onSubmit={handleSubmit}>
        <p><strong>Username:</strong> {profile.username}</p>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Profile Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />

        {profile.image_url && (
          <div style={{ marginTop: "1rem" }}>
            <img
              src={profile.image_url}
              alt="Profile"
              style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "50%" }}
            />
          </div>
        )}

        <button className="btn" type="submit"  disabled={loading}>
          {loading ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

export default Profile;