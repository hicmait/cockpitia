import { useEffect, useState } from "react";

import styles from "./NacnArticle.module.scss";
import Step1 from "./Step1";
// import ArticleStep from "./ArticleStep";
import SourceStep from "./SourceStep";
import PictureStep from "./PictureStep";
import TitleStep from "./TitleStep";

const NacnArticle = ({
  onPost,
  onPostHistory,
  setIsOpen,
  token,
  apiUrl,
  aiUrl,
  blogSearchUrl,
  lng,
  organizationId,
  initialHistory,
}) => {
  const [step, setStep] = useState("CHOICE"); // CHOICE | ARTICLE_SOURCE | ARTICLE | PICTURE | TITLE
  const [sourcesData, setSourcesData] = useState([]);
  const [resultVersions, setResultVersions] = useState({
    article: [],
    title: [],
    picture: [],
  });
  const [historyData, setHistoryData] = useState(null);

  useEffect(() => {
    if (initialHistory) {
      setHistoryData(initialHistory);
      setSourcesData(initialHistory.sources);
      setResultVersions(initialHistory.result);
    }
  }, []);

  return (
    <>
      <div className={styles.popover_content}>
        {step === "CHOICE" && (
          <Step1
            setStep={setStep}
            isEmptyArticleContent={resultVersions.article.length === 0}
          />
        )}
        {step === "ARTICLE_SOURCE" && (
          <SourceStep
            token={token}
            apiUrl={apiUrl}
            aiUrl={aiUrl}
            onPost={onPost}
            onPostHistory={(e) => {
              setHistoryData(e);
              onPostHistory(e);
            }}
            blogSearchUrl={blogSearchUrl}
            lng={lng}
            organizationId={organizationId}
            showPictureStep={() => setStep("PICTURE")}
            showTitleStep={() => {
              setStep("TITLE");
            }}
            sourcesData={sourcesData}
            setSourcesData={setSourcesData}
            resultVersions={resultVersions}
            setResultVersions={setResultVersions}
            closeStep={() => setStep("CHOICE")}
          />
        )}

        {step === "PICTURE" && (
          <PictureStep
            token={token}
            apiUrl={apiUrl}
            aiUrl={aiUrl}
            onPost={onPost}
            onPostHistory={onPostHistory}
            lng={lng}
            organizationId={organizationId}
            sourcesData={sourcesData}
            resultVersions={resultVersions}
            setResultVersions={setResultVersions}
            historyData={historyData}
            showTitleStep={() => {
              setStep("TITLE");
            }}
            closeStep={() => setStep("CHOICE")}
          />
        )}

        {step === "TITLE" && (
          <TitleStep
            token={token}
            apiUrl={apiUrl}
            aiUrl={aiUrl}
            onPost={onPost}
            onPostHistory={onPostHistory}
            lng={lng}
            sourcesData={sourcesData}
            resultVersions={resultVersions}
            setResultVersions={setResultVersions}
            historyData={historyData}
            closeStep={() => setStep("CHOICE")}
            showPictureStep={() => setStep("PICTURE")}
          />
        )}
      </div>
    </>
  );
};

export default NacnArticle;
