"use client";
import React, { use, useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import CommunityBox from "../../components/Communities/CommunityBox";
import styles from "./communitypage.module.css";
import { Button } from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";
import { Community } from "../../types";
import { Suspense } from "react";
import { useAuthContext } from "../../context/authContext";
import { FaSearch } from "react-icons/fa";

const CommunitiesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authUser, setAuthUser } = useAuthContext();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [search, setSearch] = useState<string>("");
 
  const fetchCommunities = async (searchTerm: string) => {
    try {
      const searchQueryString = searchTerm
        ? `search=${encodeURIComponent(searchTerm)}`
        : "";
      const token = localStorage.getItem("token");
      setAuthUser(token);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/community/?${searchQueryString}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Community[] = await response.json();
      console.log("Fetched communities:", data);

      if (Array.isArray(data)) {
        setCommunities(data);
      } else {
        console.error("Expected an array but got:", data);
        setCommunities([]);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };
  // useEffect(() => {
  //   if (!authUser) {
  //     router.push("/Login"); // Redirect to login page if not authenticated
  //   }
  // }, [authUser, router]);

  // const fetchCommunities = async (searchTerm: string) => {
  //   try {
  //     const searchQueryString = searchTerm
  //       ? `search=${encodeURIComponent(searchTerm)}`
  //       : "";
  //     const token = localStorage.getItem("token");
  //     setAuthUser(token);
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/api/community/?${searchQueryString}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data: Community[] = await response.json();
  //     console.log("Fetched communities:", data);

  //     if (Array.isArray(data)) {
  //       setCommunities(data);
  //     } else {
  //       console.error("Expected an array but got:", data);
  //       setCommunities([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching communities:", error);
  //   }
  // };

  useEffect(() => {
    const search = searchParams.get("search") || "";
    setSearch(search);
    fetchCommunities(search);
  }, [searchParams]);

  const handleCommunityClick = (name: string) => {
    localStorage.setItem("selectedCommunity", name);
    router.push("/Listings");
  };

  useEffect(() => {
    fetchCommunities(search);
  }, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div>
      <NavBar />
      <div className={styles.gradientBarContainer}>
        <div className={styles.gradientBar}></div>
        <div className={styles.searchBarContainer}>
          <input
            type="text"
            className={styles.communitySearch}
            placeholder="Search communities"
            value={search}
            onChange={handleSearchChange}
          />
          <Button
            style={{
              position: "relative",
              cursor: "pointer",
              borderRadius: "0.5rem",
              height: "fit-content",
              marginLeft: "0.5rem",
            }}
            onClick={() => fetchCommunities(search)}
          >
            <FaSearch />
          </Button>
        </div>
      </div>
      <div className={styles.upperContainer} style={{ width: "90%" }}>
        <div className="row">
          <div className="col">
            <h4 className="ml-15 mt-36">All Communities</h4>
          </div>
        </div>
      </div>
      <div className={styles.commContainer}>
        <div className={styles.communityList}>
          {communities.map((community) => (
            <CommunityBox
              key={community._id}
              name={community.communityName}
              picture={community.communityPicture}
              members={community.communityMembers}
              listings={community.detailedListings.length}
              onClick={() => handleCommunityClick(community.communityName)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const SuspenseWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CommunitiesPage />
    </Suspense>
  );
};

export default SuspenseWrapper;
