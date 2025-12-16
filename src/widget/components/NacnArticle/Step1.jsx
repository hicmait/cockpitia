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
          onClick={() => setStep("ARTICLE")}
        >
          <h3 className={styles.actionList_title}>Créer un article</h3>
          <p>
            Montius nos tumore inusitato quodam et novo ut rebellis et maiestati
            recalcitrantes Augustae per haec quae.
          </p>
        </li>

        <li className={styles.actionList_item}>
          <h3 className={styles.actionList_title}>Générer une image</h3>
          <p>
            Montius nos tumore inusitato quodam et novo ut rebellis et maiestati
            recalcitrantes Augustae per haec quae.
          </p>
        </li>

        <li className={styles.actionList_item}>
          <h3 className={styles.actionList_title}>Attribuer les mots clés</h3>
          <p>
            Montius nos tumore inusitato quodam et novo ut rebellis et maiestati
            recalcitrantes Augustae per haec quae.
          </p>
        </li>

        <li className={styles.actionList_item}>
          <h3 className={styles.actionList_title}>Corriger l’orthographe</h3>
          <p>
            Montius nos tumore inusitato quodam et novo ut rebellis et maiestati
            recalcitrantes Augustae per haec quae.
          </p>
        </li>
      </ul>
    </>
  );
};

export default Step1;
