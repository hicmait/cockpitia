import { useState } from "react";
import cockpitLogo from "../../../assets/cockpit.svg";
import "../../styles/index.css";
import IconClose from "../../icons/IconClose";
import NacnArticle from "../NacnArticle";
import styles from "./NacnWidget.module.scss";

export const NacnWidget = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  if (props.isHidden) {
    return null;
  }

  return (
    <div className={styles.chatContainer}>
      {isOpen && (
        <div className={styles.chatPopover}>
          {props?.appTarget === "ARTICLE" ? (
            <NacnArticle {...props} setIsOpen={setIsOpen} />
          ) : null}
        </div>
      )}

      <button
        className={`${styles.chatTrigger} ${isOpen ? styles.active : ""}`}
        onClick={() => {
          if (props.onCockpitOpen) {
            props.onCockpitOpen(!isOpen);
          }
          setIsOpen(!isOpen);
        }}
        aria-label="Ouvrir le chat"
      >
        {isOpen ? (
          <IconClose size="20" />
        ) : (
          <img src={cockpitLogo} alt="NACN AI" width={40} />
        )}
      </button>
    </div>
  );
};
