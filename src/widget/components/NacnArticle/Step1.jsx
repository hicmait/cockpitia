import { useState } from "react";

import cockpitLogo from "../../../assets/cockpit.svg";

import styles from "./NacnArticle.module.scss";

const Step1 = ({ onPost, setStep }) => {
  const [content, setContent] =
    useState(`<h3>The standard Lorem Ipsum passage, used since the 1500s</h3>
<p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
<p>Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</p>`);
  const handleClick = () => {
    if (onPost) {
      onPost(content);
    }
    setIsOpen(false);
  };

  return (
    <>
      <h2 className={styles.title}>
        <img src={cockpitLogo} alt="NACN AI" width={30} />
        Cockpit : <span>éditeur de l’article</span>
      </h2>

      <ul className={styles.actionList}>
        <li
          className={styles.actionList_item}
          onClick={() => setStep("ARTICLE_SOURCE")}
        >
          <h3 className={styles.actionList_title}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_7503_166)">
                <path
                  d="M9.99967 11.9997H6.66634M11.9997 9.33301H6.66634M2.66634 14.6663H13.333C13.6866 14.6663 14.0258 14.5259 14.2758 14.2758C14.5259 14.0258 14.6663 13.6866 14.6663 13.333V2.66634C14.6663 2.31272 14.5259 1.97358 14.2758 1.72353C14.0258 1.47348 13.6866 1.33301 13.333 1.33301H5.33301C4.97939 1.33301 4.64025 1.47348 4.3902 1.72353C4.14015 1.97358 3.99967 2.31272 3.99967 2.66634V13.333C3.99967 13.6866 3.8592 14.0258 3.60915 14.2758C3.3591 14.5259 3.01996 14.6663 2.66634 14.6663ZM2.66634 14.6663C2.31272 14.6663 1.97358 14.5259 1.72353 14.2758C1.47348 14.0258 1.33301 13.6866 1.33301 13.333V7.33301C1.33301 6.97939 1.47348 6.64025 1.72353 6.3902C1.97358 6.14015 2.31272 5.99967 2.66634 5.99967H3.99967M7.33301 3.99967H11.333C11.7012 3.99967 11.9997 4.29815 11.9997 4.66634V5.99967C11.9997 6.36786 11.7012 6.66634 11.333 6.66634H7.33301C6.96482 6.66634 6.66634 6.36786 6.66634 5.99967V4.66634C6.66634 4.29815 6.96482 3.99967 7.33301 3.99967Z"
                  stroke="url(#paint0_linear_7503_166)"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_7503_166"
                  x1="1.33301"
                  y1="7.99967"
                  x2="14.6663"
                  y2="7.99967"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#06D9B1" />
                  <stop offset="1" stop-color="#18A0FB" />
                </linearGradient>
                <clipPath id="clip0_7503_166">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Générer un article complet
          </h3>
          <p className={styles.actionList_desc}>
            Montius nos tumore inusitato quodam et novo ut rebellis et maiestati
            recalcitrantes.
          </p>
        </li>

        <li className={styles.actionList_item}>
          <h3 className={styles.actionList_title}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.33301 11C9.33301 11.0884 9.36813 11.1732 9.43064 11.2357C9.49315 11.2982 9.57794 11.3333 9.66634 11.3333H9.99967C10.3533 11.3333 10.6924 11.4738 10.9425 11.7239C11.1925 11.9739 11.333 12.313 11.333 12.6667C11.333 13.0203 11.1925 13.3594 10.9425 13.6095C10.6924 13.8595 10.3533 14 9.99967 14H5.99967C5.64605 14 5.30691 13.8595 5.05687 13.6095C4.80682 13.3594 4.66634 13.0203 4.66634 12.6667C4.66634 12.313 4.80682 11.9739 5.05687 11.7239C5.30691 11.4738 5.64605 11.3333 5.99967 11.3333H6.33301C6.42141 11.3333 6.5062 11.2982 6.56871 11.2357C6.63122 11.1732 6.66634 11.0884 6.66634 11V5C6.66634 4.91159 6.63122 4.82681 6.56871 4.7643C6.5062 4.70179 6.42141 4.66667 6.33301 4.66667H4.33301C4.2446 4.66667 4.15982 4.70179 4.09731 4.7643C4.03479 4.82681 3.99967 4.91159 3.99967 5V5.33333C3.99967 5.68696 3.8592 6.02609 3.60915 6.27614C3.3591 6.52619 3.01996 6.66667 2.66634 6.66667C2.31272 6.66667 1.97358 6.52619 1.72353 6.27614C1.47348 6.02609 1.33301 5.68696 1.33301 5.33333V3.33333C1.33301 2.97971 1.47348 2.64057 1.72353 2.39052C1.97358 2.14048 2.31272 2 2.66634 2H13.333C13.6866 2 14.0258 2.14048 14.2758 2.39052C14.5259 2.64057 14.6663 2.97971 14.6663 3.33333V5.33333C14.6663 5.68696 14.5259 6.02609 14.2758 6.27614C14.0258 6.52619 13.6866 6.66667 13.333 6.66667C12.9794 6.66667 12.6402 6.52619 12.3902 6.27614C12.1401 6.02609 11.9997 5.68696 11.9997 5.33333V5C11.9997 4.91159 11.9646 4.82681 11.902 4.7643C11.8395 4.70179 11.7547 4.66667 11.6663 4.66667H9.66634C9.57794 4.66667 9.49315 4.70179 9.43064 4.7643C9.36813 4.82681 9.33301 4.91159 9.33301 5V11Z"
                stroke="url(#paint0_linear_7503_177)"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_7503_177"
                  x1="1.33301"
                  y1="8"
                  x2="14.6663"
                  y2="8"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#06D9B1" />
                  <stop offset="1" stop-color="#18A0FB" />
                </linearGradient>
              </defs>
            </svg>
            Générer un titre
          </h3>
          <p className={styles.actionList_desc}>
            Montius nos tumore inusitato quodam et novo ut rebellis et maiestati
            recalcitrantes.
          </p>
        </li>

        <li className={styles.actionList_item}>
          <h3 className={styles.actionList_title}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 10L11.9427 7.94267C11.6926 7.69271 11.3536 7.55229 11 7.55229C10.6464 7.55229 10.3074 7.69271 10.0573 7.94267L4 14M3.33333 2H12.6667C13.403 2 14 2.59695 14 3.33333V12.6667C14 13.403 13.403 14 12.6667 14H3.33333C2.59695 14 2 13.403 2 12.6667V3.33333C2 2.59695 2.59695 2 3.33333 2ZM7.33333 6C7.33333 6.73638 6.73638 7.33333 6 7.33333C5.26362 7.33333 4.66667 6.73638 4.66667 6C4.66667 5.26362 5.26362 4.66667 6 4.66667C6.73638 4.66667 7.33333 5.26362 7.33333 6Z"
                stroke="url(#paint0_linear_7506_809)"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_7506_809"
                  x1="2"
                  y1="8"
                  x2="14"
                  y2="8"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#06D9B1" />
                  <stop offset="1" stop-color="#18A0FB" />
                </linearGradient>
              </defs>
            </svg>
            Choisir / Générer image
          </h3>
          <p className={styles.actionList_desc}>
            Montius nos tumore inusitato quodam et novo ut rebellis et maiestati
            recalcitrantes.
          </p>
        </li>

        <li className={styles.actionList_item}>
          <h3 className={styles.actionList_title}>Corriger l’orthographe</h3>
          <p className={styles.actionList_desc}>
            Montius nos tumore inusitato quodam et novo ut rebellis et maiestati
            recalcitrantes.
          </p>
        </li>
      </ul>
    </>
  );
};

export default Step1;
