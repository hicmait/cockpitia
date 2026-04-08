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
      // let isUsedVersion = initialHistory.result.article.filter((i) => i.isUsed);
      // setSelectedVersion(
      //   isUsedVersion?.length === 1
      //     ? isUsedVersion[0]
      //     : initialHistory.result.article[0],
      // );
    }
  }, []);

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
            onPostHistory={(e) => {
              setHistoryData(e);
              onPostHistory(e);
            }}
            setIsOpen={setIsOpen}
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
          />
        )}

        {step === "PICTURE" && (
          <PictureStep
            token={token}
            apiUrl={apiUrl}
            aiUrl={aiUrl}
            onPost={onPost}
            onPostHistory={onPostHistory}
            setIsOpen={setIsOpen}
            lng={lng}
            organizationId={organizationId}
            sourcesData={sourcesData}
            resultVersions={resultVersions}
            setResultVersions={setResultVersions}
            historyData={historyData}
            showTitleStep={() => {
              setStep("TITLE");
            }}
          />
        )}

        {step === "TITLE" && (
          <TitleStep
            token={token}
            apiUrl={apiUrl}
            aiUrl={aiUrl}
            onPost={onPost}
            onPostHistory={onPostHistory}
            setIsOpen={setIsOpen}
            lng={lng}
            sourcesData={sourcesData}
            resultVersions={resultVersions}
            setResultVersions={setResultVersions}
            historyData={historyData}
          />
        )}
      </div>
    </>
  );
};

export default NacnArticle;
