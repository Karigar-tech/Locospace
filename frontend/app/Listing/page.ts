import dynamic from "next/dynamic";

const ListingPage = dynamic(() => import("./ListingPage"), {
  ssr: false,
});

export default ListingPage;
