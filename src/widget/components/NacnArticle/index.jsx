import { useState } from "react";

import styles from "./NacnArticle.module.scss";
import Step1 from "./Step1";
import ArticleStep from "./ArticleStep";
import SourceStep from "./SourceStep";

const NacnArticle = ({
  onPost,
  setIsOpen,
  token,
  apiUrl,
  aiUrl,
  blogSearchUrl,
  lng,
  organizationId,
}) => {
  const [step, setStep] = useState("CHOICE"); // CHOICE | ARTICLE_SOURCE | ARTICLE | PICTURE

  return (
    <>
      <div className={` ${styles.popover}`}>
        {step === "CHOICE" && <Step1 setStep={setStep} />}
        {step === "ARTICLE_SOURCE" && (
          <SourceStep
            token={token}
            apiUrl={apiUrl}
            aiUrl={aiUrl}
            onPost={onPost}
            setIsOpen={setIsOpen}
            blogSearchUrl={blogSearchUrl}
            lng={lng}
            organizationId={organizationId}
          />
        )}
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
