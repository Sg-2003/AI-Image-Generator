import React from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { AddRounded, ExploreRounded } from "@mui/icons-material";
import Button from "./button";

const Container = styled.div`
  background: ${({ theme }) => theme.navbar};
  color: ${({ theme }) => theme.text_primary};
  font-weight: bold;
  font-size: 22px;
  padding: 14px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  @media only screen and (max-width: 600px) {
    padding: 10px 12px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  font-size: 22px;
  cursor: pointer;
  color: ${({ theme }) => theme.text_primary};
`;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/");
  return (
    <Container>
      <Logo onClick={() => navigate("/")}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ab47bc" />
              <stop offset="100%" stopColor="#2196f3" />
            </linearGradient>
          </defs>
          <rect x="3" y="3" width="8" height="8" rx="2" fill="url(#grad)" />
          <rect x="13" y="3" width="8" height="8" rx="2" fill="url(#grad)" opacity="0.7" />
          <rect x="3" y="13" width="8" height="8" rx="2" fill="url(#grad)" opacity="0.7" />
          <rect x="13" y="13" width="8" height="8" rx="2" fill="#eab308" />
          <circle cx="17" cy="17" r="1.5" fill="#fff" />
        </svg>
        <span>PixelForge</span>
      </Logo>
      {path[1] === "post" ? (
        <Button
          onClick={() => navigate("/")}
          text="Explore Posts"
          leftIcon={
            <ExploreRounded
              style={{
                fontSize: "18px",
              }}
            />
          }
          type="secondary"
        />
      ) : (
        <Button
          onClick={() => navigate("/post")}
          text="Create new post"
          leftIcon={
            <AddRounded
              style={{
                fontSize: "18px",
              }}
            />
          }
        />
      )}
    </Container>
  );
};

export default Navbar;
