import { useEffect, useState } from "react";
import Select from "react-select";

import cockpitLogo from "../../../assets/cockpit.svg";
import { genetateTitle } from "../../api";
import { addLandaSize } from "../../services/utils";
import styles from "./NacnArticle.module.scss";
import IconSpinner from "../../icons/IconSpinner";
import IconArrowTop from "../../icons/IconArrowTop";
import IconDoubleCheck from "../../icons/IconDoubleCheck";
import IconEye from "../../icons/IconEye";
import Checkbox from "../common/Checkbox";

const TitleStep = ({
  onPost,
  onPostHistory,
  setIsOpen,
  token,
  apiUrl,
  aiUrl,
  lng,
  resultVersions,
  setResultVersions,
  historyData,
}) => {
  const [step, setStep] = useState("SELECT"); // SELECT | GENERATE
  const [isFetching, setIsFetching] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [isFetchingInstruction, setIsFetchingInstruction] = useState(false);

  const [selectedVersion, setSelectedVersion] = useState(null);

  const handleClick = () => {
    if (onPost && selectedVersion) {
      onPost({
        type: "ARTICLE_TITLE",
        data: {
          content: selectedVersion.content,
        },
      });
      setSelectedVersion({ ...selectedVersion, isUsed: true });
    }

    if (onPost) {
      onPost({
        type: "ARTICLE_TITLE",
        data: {
          content: selectedVersion.content,
        },
      });
      if (onPostHistory) {
        let tabVersions = resultVersions.title.map((i) => {
          if (i.value == selectedVersion.value) {
            return { ...i, isUsed: true };
          }
          return i;
        });
        onPostHistory({
          ...historyData,
          result: { ...resultVersions, title: tabVersions },
        });
        console.log(
          JSON.stringify({
            ...historyData,
            result: { ...resultVersions, title: tabVersions },
          }),
        );
      }
    }
    setSelectedVersion({ ...selectedVersion, isUsed: true });
  };

  useEffect(() => {
    const fetchData = async (content) => {
      setIsFetching(true);

      // try {
      //   const response = await genetateTitle({
      //     aiUrl,
      //     token,
      //     content,
      //     language: lng,
      //   });
      //   if (response && response.title) {
      //     let tab = [
      //       {
      //         value: "version1",
      //         label: "version 1",
      //         content: response.title,
      //         isUsed: false,
      //       },
      //     ];
      //     setResultVersions({ ...resultVersions, title: tab });
      //     setSelectedVersion(tab[0]);
      // setIsFetching(false);
      // setIsFetched(true);
      //   }
      // } catch (e) {
      //   setIsFetching(false);
      // setIsFetched(true);
      // }

      setTimeout(() => {
        let tab = [
          {
            value: "version1",
            label: "version 1",
            content: "Mon titre proposé",
            isUsed: false,
          },
        ];
        setResultVersions({ ...resultVersions, title: tab });
        setSelectedVersion(tab[0]);

        setIsFetching(false);
        setIsFetched(true);
      }, 2000);
    };

    if (!isFetching && !isFetched && resultVersions.article.length > 0) {
      if (resultVersions.article.length > 0) {
        if (resultVersions.title.length === 0) {
          let isUsedVersion = resultVersions.article.filter((i) => i.isUsed);
          const content =
            isUsedVersion?.length === 1
              ? isUsedVersion[0].content
              : resultVersions.article[0].content;

          fetchData(content);
        } else {
          let isUsedVersion = resultVersions.title.filter((i) => i.isUsed);
          setSelectedVersion(
            isUsedVersion?.length === 1
              ? isUsedVersion[0]
              : resultVersions.title[0],
          );
        }
      }
    }
  }, []);

  const handleInstructionClick = () => {
    if (instruction.length == 0) {
      return null;
    }

    // setResultVersions(tab);
    // setSelectedVersion(tab[1]);
    setInstruction("");
  };

  const handleShowSource = () => {
    // let tab = [];
    // if (textSources.length > 0 && textSources[0].length > 0) {
    //   tab.push({ tab: "TEXT", label: "Texte manuel", items: textSources });
    // }
    // if (linkSources[0]?.content.length > 0) {
    //   tab.push({ tab: "LINK", label: "Lien web", items: linkSources });
    // }
    // if (blogSources[0]?.article) {
    //   tab.push({ tab: "BLOG", label: "Blog", items: blogSources });
    // }
    // if (eventSources[0]?.event) {
    //   tab.push({ tab: "EVENT", label: "Event", items: eventSources });
    // }
    // if (tab.length > 0) {
    //   setCurrentType(tab[0].tab);
    //   setCurrentIndex(0);
    // }
    // setSourcesData(tab);
    // setIsOpenSourceModal(true);
  };

  return (
    <>
      <h2 className={styles.title}>
        <img src={cockpitLogo} alt="NACN AI" width={30} />
        Générer un titre
      </h2>

      {selectedVersion && (
        <div className={styles.result_top}>
          <div className={styles.result_top_left}>
            <span>Titre:</span>
            <Select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e)}
              options={resultVersions.title}
              styles={{
                input: (provided) => ({
                  ...provided,
                  height: "auto",
                  margin: "0",
                }),
                control: (base) => ({
                  ...base,
                  border: 0,
                  boxShadow: "none",
                }),
                indicatorSeparator: (provided) => ({ display: "none" }),
                dropdownIndicator: (provided) => ({
                  ...provided,
                  padding: "4px 0",
                }),
              }}
            />
          </div>

          {/* <div className={styles.result_top_right}>
            Sources:{" "}
            <span onClick={handleShowSource} className={styles.pointer}>
              <IconEye />
            </span>
          </div> */}
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.resultContainer}>
          {isFetching ? (
            <div className={styles.spinner}>
              <IconSpinner size="20" />
            </div>
          ) : (
            <>
              {selectedVersion && (
                <div className={styles.results}>{selectedVersion.content}</div>
              )}
            </>
          )}
        </div>

        {/* <div className={styles.result_actions}>
          <button
            className="primaryBtn"
            onClick={handleClick}
            disabled={!selectedVersion}
          >
            Utiliser cette version
          </button>
        </div> */}
        {selectedVersion &&
          (!selectedVersion.isUsed ? (
            <div className={styles.result_actions}>
              <button
                className="primaryBtn"
                disabled={!selectedVersion}
                onClick={handleClick}
              >
                Utiliser cette version
              </button>
            </div>
          ) : (
            <div className={styles.result_used}>
              <IconDoubleCheck />{" "}
              {selectedVersion ? selectedVersion.label : "version 1"} a été
              utilisée pour l’article
            </div>
          ))}

        {/* <div className={styles.update_instruction_alt}>
          <h3 className={styles.subtitle}>Désirez-vous autre chose ?</h3>
          <div className={styles.update_instruction_alt_actions}>
            <button>Générer un titre</button>
            <button>Générer les mots clés</button>
            <button>Générer un post LinkedIn</button>
          </div>
        </div> */}

        <div className={styles.update_instruction}>
          <h3 className={styles.subtitle}>
            Instruction pour modifier la{" "}
            {selectedVersion ? selectedVersion.label : "version 1"}
          </h3>

          <textarea
            className={`${styles.textContent} `}
            rows="4"
            placeholder="Donnez vos instructions..."
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            disabled={!selectedVersion}
          ></textarea>

          {isFetchingInstruction ? (
            <span className={`${styles.update_arrow} ${styles.active}`}>
              <span className={styles.spinner}>
                <IconSpinner size="20" />
              </span>
            </span>
          ) : (
            <span
              className={`${styles.update_arrow} ${
                instruction.length > 0 && styles.active
              }`}
              onClick={handleInstructionClick}
            >
              <IconArrowTop size={20} />
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default TitleStep;
