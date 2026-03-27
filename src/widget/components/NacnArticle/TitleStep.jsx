import { useEffect, useState } from "react";
import debounce from "lodash.debounce";

import cockpitLogo from "../../../assets/cockpit.svg";
import { getMedias } from "../../api";
import { addLandaSize } from "../../services/utils";
import styles from "./NacnArticle.module.scss";
import IconSpinner from "../../icons/IconSpinner";
import IconArrowTop from "../../icons/IconArrowTop";
import Checkbox from "../common/Checkbox";

const TitleStep = ({
  onPost,
  setIsOpen,
  token,
  apiUrl,
  aiUrl,
  lng,
  selectedText,
}) => {
  const [step, setStep] = useState("SELECT"); // SELECT | GENERATE
  const [isFetching, setIsFetching] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [medias, setMedias] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [instruction, setInstruction] = useState("");

  const [resultVersions, setResultVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const handleClick = () => {
    if (onPost && selectedMedia) {
      onPost({
        type: "PICTURE_MEDIA",
        data: {
          content: selectedMedia,
        },
      });
    }
    setSelectedVersion(selectedMedia);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);

      const response = await genetateTitle({
        aiUrl,
        token,
        content: selectedVersion.content,
        language: lng,
      });
      if (response && response.title) {
        let tab = [
          {
            value: "version1",
            label: "version 1",
            content: response.title,
            isUsed: false,
          },
        ];
        setResultVersions(tab);
        setSelectedVersion(tab[0]);
      }
      setIsFetching(false);
      setIsFetched(true);
    };

    if (!isFetching && selectedText) {
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
        Générer un titre
      </h2>

      <div className={styles.container}>
        {step === "SELECT" && (
          <>
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
            <div className={styles.pictureCover}></div>
            <div className={styles.result_actions}>
              <button
                className="primaryBtn"
                onClick={handleClick}
                disabled={!selectedMedia}
              >
                Utiliser cette version
              </button>
            </div>
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
        )}

        <div className={styles.update_instruction_alt}>
          <h3 className={styles.subtitle}>Désirez-vous autre chose ?</h3>
          <div className={styles.update_instruction_alt_actions}>
            <button>Générer un titre</button>
            <button>Générer les mots clés</button>
            <button>Générer un post LinkedIn</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TitleStep;
