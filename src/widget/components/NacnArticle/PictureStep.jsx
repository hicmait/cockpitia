import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import Select from "react-select";

import cockpitLogo from "../../../assets/cockpit.svg";
import { getMedias, genetateImage } from "../../api";
import { addLandaSize } from "../../services/utils";
import styles from "./NacnArticle.module.scss";
import IconSpinner from "../../icons/IconSpinner";
import IconArrowTop from "../../icons/IconArrowTop";
import IconDoubleCheck from "../../icons/IconDoubleCheck";
import Checkbox from "../common/Checkbox";

import dataPicture from "./datapicture.json";

const PictureStep = ({
  onPost,
  onPostHistory,
  setIsOpen,
  token,
  apiUrl,
  aiUrl,
  organizationId,
  lng,
  sourcesData,
  resultVersions,
  setResultVersions,
  historyData,
  showTitleStep,
}) => {
  const [step, setStep] = useState("SELECT"); // SELECT | GENERATE
  const [isFetching, setIsFetching] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [medias, setMedias] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [instruction, setInstruction] = useState("");

  useEffect(() => {
    const fetchPicture = async (content) => {
      setIsFetching(true);

      // try {
      //   const response = await genetateImage({
      //     aiUrl,
      //     token,
      //     content,
      //     language: lng,
      //   });

      //   if (response && response.image_base64) {
      //     let tab = [
      //       {
      //         value: "version1",
      //         label: "version 1",
      //         content: response.image_base64,
      //         isUsed: false,
      //       },
      //     ];
      //     setResultVersions({ ...resultVersions, picture: tab });
      //     setSelectedVersion(tab[0]);
      //     setIsFetching(false);
      //   }
      // } catch (e) {
      //   setIsFetching(false);
      // }

      setTimeout(() => {
        let tab = [
          {
            value: "version1",
            label: "version 1",
            content: dataPicture.image_base64,
            isUsed: false,
          },
        ];
        setResultVersions({ ...resultVersions, picture: tab });
        setSelectedVersion(tab[0]);

        setIsFetching(false);
      }, 2000);
    };

    if (
      step === "GENERATE" &&
      !isFetching &&
      resultVersions.article.length > 0
    ) {
      if (resultVersions.article.length > 0) {
        if (resultVersions.picture.length === 0) {
          let isUsedVersion = resultVersions.article.filter((i) => i.isUsed);
          const content =
            isUsedVersion?.length === 1
              ? isUsedVersion[0].content
              : resultVersions.article[0].content;

          fetchPicture(content);
        } else {
          let isUsedVersion = resultVersions.picture.filter((i) => i.isUsed);
          setSelectedVersion(
            isUsedVersion?.length === 1
              ? isUsedVersion[0]
              : resultVersions.picture[0],
          );
        }
      }
    }
  }, [step]);

  const handleGenerateUseClick = () => {
    if (onPost) {
      onPost({
        type: "PICTURE_NEW",
        data: {
          content: selectedVersion.content,
        },
      });
      if (onPostHistory) {
        let tabVersions = resultVersions.picture.map((i) => {
          if (i.value == selectedVersion.value) {
            return { ...i, isUsed: true };
          }
          return i;
        });
        onPostHistory({
          ...historyData,
          result: { ...resultVersions, picture: tabVersions },
        });
        console.log(
          JSON.stringify({
            ...historyData,
            result: { ...resultVersions, picture: tabVersions },
          }),
        );
      }
    }
    setSelectedVersion({ ...selectedVersion, isUsed: true });
  };

  const handleClick = () => {
    if (onPost && selectedMedia) {
      onPost({
        type: "PICTURE_MEDIA",
        data: {
          content: selectedMedia,
        },
      });
    }
    // setSelectedVersion(selectedMedia);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    debouncedSearch(value);
  };

  const debouncedSearch = debounce(async (value) => {
    setIsFetching(true);
    try {
      let params = {
        apiUrl,
        token,
        limit: 24,
        offset: page - 1,
        communityId: organizationId,
        type: "IMAGE",
        allowedMediaTypes: ["IMAGE"],
        lng,
        filterBy: {
          search,
        },
      };
      const response = await getMedias(params);

      setIsFetching(false);
      setIsFetched(true);
      setMedias(response.data.data);
    } catch (e) {
      if (!e?.response?.status === 700) {
        setIsFetching(false);
        setMedias([]);
      }
    }
  }, 1000);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        let params = {
          apiUrl,
          token,
          limit: 24,
          offset: page - 1,
          communityId: organizationId,
          type: "IMAGE",
          allowedMediaTypes: ["IMAGE"],
          lng,
          filterBy: {
            search,
          },
        };
        const response = await getMedias(params);

        setIsFetching(false);
        setIsFetched(true);
        setMedias(response.data.data);
      } catch (e) {
        if (!e?.response?.status === 700) {
          setIsFetching(false);
          setMedias([]);
        }
      }
    };

    if (!isFetching) {
      fetchData();
    }
  }, [page]);

  const handleInstructionClick = () => {
    if (instruction.length == 0) {
      return null;
    }

    // setResultVersions(tab);
    // setSelectedVersion(tab[1]);
    setInstruction("");
  };

  return (
    <>
      <h2 className={styles.title}>
        <img src={cockpitLogo} alt="NACN AI" width={30} />
        Choisir / Générer image
      </h2>

      <div className={styles.container}>
        <ul className={styles.tabs}>
          <li
            onClick={() => {
              setStep("SELECT");
            }}
            className={`${styles.tabs_item} ${
              step === "SELECT" && styles.active
            }`}
          >
            Choisir une image
          </li>
          <li
            onClick={() => {
              setStep("GENERATE");
            }}
            className={`${styles.tabs_item} ${
              step === "GENERATE" && styles.active
            }`}
          >
            Générer une image
          </li>
        </ul>

        {step === "SELECT" && (
          <>
            <div className={styles.picture_top}>
              <p className={styles.subtitle}>
                Voici quelques propositions d’images :
              </p>

              <div className={styles.picture_search}>
                <input
                  type="text"
                  className={styles.textContent}
                  value={search}
                  placeholder="Recherche..."
                  onChange={(e) => {
                    handleSearchChange(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className={styles.resultContainer}>
              {isFetching ? (
                <div className={styles.spinner}>
                  <IconSpinner size="20" />
                </div>
              ) : (
                <>
                  <div className={styles.results}>
                    <div className={styles.medias_list}>
                      {medias.map((media) => {
                        let path = "";
                        const {
                          preview,
                          fullMediaUrl,
                          webPath,
                          createdAt,
                          docType,
                        } = media;
                        if (docType === "IMAGE") {
                          path = fullMediaUrl
                            ? fullMediaUrl
                            : apiUrl + "/" + webPath;
                        }
                        path = path ? addLandaSize(path, 280) : "";

                        if (!path) {
                          return null;
                        }

                        return (
                          <div
                            key={`media-${media.id}`}
                            className={styles.medias_list_item}
                            onClick={() => setSelectedMedia(media)}
                          >
                            <Checkbox
                              checked={selectedMedia?.id === media.id}
                              radio={true}
                            />
                            <div
                              className={styles.mediaContent}
                              style={{ backgroundImage: `url(${path})` }}
                            ></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className={styles.result_actions}>
              <button
                className="primaryBtn"
                onClick={handleClick}
                disabled={!selectedMedia}
              >
                Utiliser cette version
              </button>
            </div>
          </>
        )}

        {step === "GENERATE" && (
          <div>
            {selectedVersion && (
              <div className={styles.result_top}>
                <div className={styles.result_top_left}>
                  <span>Image:</span>
                  <Select
                    value={selectedVersion}
                    onChange={(e) => setSelectedVersion(e)}
                    options={resultVersions.picture}
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
                      <div className={styles.results}>
                        <img
                          src={
                            selectedVersion?.media
                              ? selectedVersion.media.url
                              : `data:image/png;base64,${selectedVersion.content}`
                          }
                          alt=""
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              {selectedVersion &&
                (!selectedVersion.isUsed ? (
                  <div className={styles.result_actions}>
                    <button
                      className="primaryBtn"
                      disabled={!selectedVersion}
                      onClick={handleGenerateUseClick}
                    >
                      Utiliser cette version
                    </button>
                  </div>
                ) : (
                  <div className={styles.result_used}>
                    <IconDoubleCheck />{" "}
                    {selectedVersion ? selectedVersion.label : "version 1"} a
                    été utilisée pour l’article
                  </div>
                ))}

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

                <span
                  className={`${styles.update_arrow} ${
                    instruction.length > 0 && styles.active
                  }`}
                  onClick={handleInstructionClick}
                >
                  <IconArrowTop size={20} />
                </span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.update_instruction_alt}>
          <h3 className={styles.subtitle}>Désirez-vous autre chose ?</h3>
          <div className={styles.update_instruction_alt_actions}>
            <button onClick={showTitleStep}>Générer un titre</button>
            <button>Générer les mots clés</button>
            <button>Générer un post LinkedIn</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PictureStep;
