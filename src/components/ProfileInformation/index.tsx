import InfoCard from "../InfoCard";

const ProfileInformation = () => {
  const personalInfo = [
    { label: "Full Name", value: "John Doe" },
    { label: "Email Address", value: "johndoe@gmail.com" },
    { label: "Gender", value: "Male" },
    { label: "Phone Number", value: "+91 - 7895633735" },
    { label: "Role", value: "Manufacturer" },
  ];

  const addressInfo = [
    { label: "Village", value: "Shivaji nagar" },
    { label: "Town/City", value: "Rishikesh" },
    { label: "Country", value: "India" },
    { label: "Postal Code", value: "249203" },
  ];

  const handleEditPersonal = () => {
    console.log("Edit personal information");
  };

  const handleEditAddress = () => {
    console.log("Edit address information");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <InfoCard
        title="Personal Information"
        fields={personalInfo}
        onEdit={handleEditPersonal}
      />

      <InfoCard
        title="Address"
        fields={addressInfo}
        onEdit={handleEditAddress}
      />
    </div>
  );
};

export default ProfileInformation;
