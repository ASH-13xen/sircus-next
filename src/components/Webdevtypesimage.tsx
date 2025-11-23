import Image from "next/image";

export default function Webdevtypesimage() {
  return (
    <Image 
      src="/images/Webdevtypes.png" 
      alt="Web Dev Types"
      width={500} 
      height={300} 
      style={{
        display: "block",
        margin: "0 auto",
        borderRadius: "8px",
        padding: "1em"
      }}
    />
  );
}
