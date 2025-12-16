import { useState } from "react";

import styles from "./NacnArticle.module.scss";
import Step1 from "./Step1";
import ArticleStep from "./ArticleStep";

const NacnArticle = ({ onPost, setIsOpen, token, apiUrl, aiUrl }) => {
  const [step, setStep] = useState("CHOICE"); // CHOICE | ARTICLE | PICTURE

  return (
    <>
      <div className={` ${styles.popover}`}>
        {step === "CHOICE" && <Step1 setStep={setStep} />}
        {step === "ARTICLE" && (
          <ArticleStep
            onPost={onPost}
            token={token}
            apiUrl={apiUrl}
            aiUrl={aiUrl}
            setIsOpen={setIsOpen}
          />
        )}

        <div className={styles.popover_arrow}></div>
      </div>
    </>
  );
};

export default NacnArticle;
