import { useState } from "react";

import styles from "./NacnArticle.module.scss";
import Step1 from "./Step1";
// import ArticleStep from "./ArticleStep";
import SourceStep from "./SourceStep";
// import PictureStep from "./PictureStep";

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
      <div className={styles.popover_content}>
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
            showPictureStep={() => setStep("PICTURE")}
          />
        )}

        {/* {step === "PICTURE" && (
            <PictureStep
              token={token}
              apiUrl={apiUrl}
              onPost={onPost}
              setIsOpen={setIsOpen}
              lng={lng}
              organizationId={organizationId}
            />
          )} */}

        {/* {step === "ARTICLE" && (
            <ArticleStep
              onPost={onPost}
              token={token}
              apiUrl={apiUrl}
              aiUrl={aiUrl}
              setIsOpen={setIsOpen}
            />
          )} */}
      </div>
    </>
  );
};

export default NacnArticle;
