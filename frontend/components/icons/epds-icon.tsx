import React from "react";
import { JSX } from "react/jsx-runtime";

const Logo201 = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props} // allows you to pass className, style, etc.
  >
    <path
      d="M4 12V4.00001C4 3.46957 4.21071 2.96087 4.58579 2.58579C4.96086 2.21072 5.46957 2.00001 6 2.00001H14C14.3169 1.99923 14.6308 2.06122 14.9236 2.18239C15.2164 2.30357 15.4823 2.48153 15.706 2.70601L19.294 6.29401C19.5185 6.51768 19.6964 6.78359 19.8176 7.0764C19.9388 7.36921 20.0008 7.68312 20 8.00001V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22"
      stroke="black"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89464 14.7348 8 15 8H20"
      stroke="black"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 16H13V22"
      stroke="black"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 22H15"
      stroke="black"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 18C8 16.8954 7.10457 16 6 16C4.89543 16 4 16.8954 4 18V20C4 21.1046 4.89543 22 6 22C7.10457 22 8 21.1046 8 20V18Z"
      stroke="black"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 9C7 8 8 7 9 7C10.5 7 11 8 11 9C11 10 10.5 10.5 10.5 10.5L7.5 13"
      stroke="black"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <path
      d="M7.5 13H11.5"
      stroke="black"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);

export default Logo201;
