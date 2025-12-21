import { useEffect, useState } from "react";

import { Radio } from "antd";

import cockpitLogo from "../../../assets/cockpit.svg";
import { getMedias } from "../../api";
import { addLandaSize } from "../../services/utils";
import styles from "./NacnArticle.module.scss";
import IconSpinner from "../../icons/IconSpinner";

const PictureStep = ({
  onPost,
  setIsOpen,
  token,
  apiUrl,
  organizationId,
  lng,
}) => {
  const [step, setStep] = useState("SELECT"); // SELECT | GENERATE
  const [isFetching, setIsFetching] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [medias, setMedias] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [page, setPage] = useState(1);

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
      try {
        const response = await getMedias({
          apiUrl,
          token,
          limit: 24,
          offset: page - 1,
          communityId: organizationId,
          type: "IMAGE",
          allowedMediaTypes: ["IMAGE"],
          lng,
        });
        console.log("aaaaa", response);

        setIsFetching(false);
        setIsFetched(true);
        setMedias(response.data.data);
      } catch (e) {
        setIsFetching(false);
        setMedias([]);
      }
    };

    if (!isFetching) {
      fetchData();
    }
  }, [page]);

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

        <div className={styles.resultContainer}>
          {isFetching ? (
            <div className={styles.spinner}>
              <IconSpinner size="20" />
            </div>
          ) : (
            <div className={styles.results}>
              <p className={styles.subtitle}>
                Voici quelques propositions d’images :
              </p>

              <div className={styles.medias_list}>
                {medias.map((media) => {
                  let path = "";
                  const { preview, fullMediaUrl, webPath, createdAt, docType } =
                    media;
                  if (docType === "IMAGE") {
                    path = fullMediaUrl ? fullMediaUrl : apiUrl + "/" + webPath;
                  }
                  path = path ? addLandaSize(path, 280) : "";
                  console.log("eeeee", path);

                  if (!path) {
                    return null;
                  }

                  return (
                    <div
                      key={`media-${media.id}`}
                      className={styles.medias_list_item}
                      onClick={() => setSelectedMedia(media)}
                    >
                      <Radio checked={selectedMedia?.id === media.id}></Radio>
                      <div
                        className={styles.mediaContent}
                        style={{ backgroundImage: `url(${path})` }}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>
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

export default PictureStep;
