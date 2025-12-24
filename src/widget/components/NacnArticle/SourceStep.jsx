import { useEffect, useState } from "react";
import Select from "react-select";
import Modal from "react-modal";
// import { Modal } from "antd";

import cockpitLogo from "../../../assets/cockpit.svg";
import { tamtamIt, getPrompts, genetateArticle } from "../../api";
import styles from "./NacnArticle.module.scss";
import modalStyles from "./Modal.module.scss";

import Loader from "../common/Loader";
import IconEye from "../../icons/IconEye";
import TextSource from "./Source/TextSource";
import LinkSource from "./Source/LinkSource";
import BlogSource from "./Source/BlogSource";
import EventSource from "./Source/EventSource";
import IconArrowTop from "../../icons/IconArrowTop";
import IconDoubleCheck from "../../icons/IconDoubleCheck";
import IconClose from "../../icons/IconClose";
import IconEyeSource from "../../icons/IconEyeSource";
import IconPencil from "../../icons/IconPencil";

const SourceStep = ({
  onPost,
  setIsOpen,
  token,
  apiUrl,
  aiUrl,
  organizationId,
  lng,
  blogSearchUrl,
  showPictureStep,
}) => {
  const [step, setStep] = useState("SOURCE"); // SOURCE | RESULT
  const [currentType, setCurrentType] = useState("TEXT"); // TEXT | LINK | BLOG | EVENT
  const [textSources, setTextSources] = useState([""]);
  const [linkSources, setLinkSources] = useState([{ link: "", content: "" }]);
  const [blogSources, setBlogSources] = useState([
    { search: "", article: null },
  ]);
  const [eventSources, setEventSources] = useState([
    { search: "", event: null },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const [instruction, setInstruction] = useState("");
  const [content, setContent] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [isFetchingPrompt, setIsFetchingPrompt] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [resultVersions, setResultVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isOpenSourceModal, setIsOpenSourceModal] = useState(false);
  const [isOpenConfirmSourceModal, setIsOpenConfirmSourceModal] =
    useState(false);
  const [sourcesData, setSourcesData] = useState([]);

  const handleGenerateText = async () => {
    // if (inputValue.length > 0 && selectedPrompt) {
    //   setIsFetching(true);
    //   const articleContent = await genetateArticle({
    //     aiUrl,
    //     token,
    //     content: inputValue,
    //     promptId: selectedPrompt.id,
    //   });
    //   console.log(articleContent);
    //   if (articleContent?.data?.answer) {
    //     setContent(articleContent.data.answer);
    //   }
    //   setStep(2);
    //   setIsFetching(false);
    // }
    let txt = `<p>🌿 À compter du 1er janvier 2026, toutes les entreprises proposant des services de livraison à domicile en milieu urbain doivent adopter des pratiques respectueuses de l’environnement et de la tranquillité publique. Les véhicules utilisés pour les livraisons dans les centres-villes devront être exclusivement électriques ou hybrides rechargeables, afin de limiter les émissions polluantes et le bruit. Les entreprises de livraison sont également tenues de regrouper les colis et d’optimiser leurs tournées pour réduire la circulation inutile et les embouteillages.</p>

<p>🏙️ Les communes ont la responsabilité de mettre en place des zones de livraison réglementées et des horaires précis afin de limiter les nuisances sonores, particulièrement en soirée et la nuit. Les plateformes de livraison sont encouragées à collaborer avec les commerces locaux pour mutualiser les trajets et favoriser l’implantation de points de retrait accessibles à pied ou à vélo.</p>

<p>⚖️ Tout manquement aux obligations fixées par le présent article pourra entraîner des sanctions administratives, incluant des amendes et, en cas de récidive, la suspension temporaire de l’autorisation d’exploiter le service dans la commune concernée. Les modalités précises d’application seront définies par arrêté royal après concertation avec les Régions et les représentants du secteur.</p>`;
    let tab = [
      { value: "version1", label: "version 1", content: txt, isUsed: false },
    ];
    setResultVersions(tab);
    setSelectedVersion(tab[0]);
    setStep("RESULT");
  };

  const handleClick = () => {
    if (onPost) {
      onPost({
        type: "ARTICLE_DATA",
        data: {
          content: selectedVersion.content,
        },
      });
    }
    setSelectedVersion({ ...selectedVersion, isUsed: true });
    // setIsOpen(false);
  };

  const handleInstructionClick = () => {
    if (instruction.length == 0) {
      return null;
    }

    const txt = `<p>À compter du 1er janvier 2026, toutes les entreprises proposant des services de livraison à domicile en milieu urbain doivent adopter des pratiques respectueuses de l’environnement et de la tranquillité publique. Les véhicules utilisés pour les livraisons dans les centres-villes devront être exclusivement électriques ou hybrides rechargeables, afin de limiter les émissions polluantes et le bruit. Les entreprises de livraison sont également tenues de regrouper les colis et d’optimiser leurs tournées pour réduire la circulation inutile et les embouteillages.</p>

<p>Les communes ont la responsabilité de mettre en place des zones de livraison réglementées et des horaires précis afin de limiter les nuisances sonores, particulièrement en soirée et la nuit. Les plateformes de livraison sont encouragées à collaborer avec les commerces locaux pour mutualiser les trajets et favoriser l’implantation de points de retrait accessibles à pied ou à vélo.</p>

<p>Tout manquement aux obligations fixées par le présent article pourra entraîner des sanctions administratives, incluant des amendes et, en cas de récidive, la suspension temporaire de l’autorisation d’exploiter le service dans la commune concernée. Les modalités précises d’application seront définies par arrêté royal après concertation avec les Régions et les représentants du secteur.</p>`;
    let tab = [
      ...resultVersions,
      { value: "version2", label: "version 2", content: txt, isUsed: false },
    ];
    setResultVersions(tab);
    setSelectedVersion(tab[1]);
    setInstruction("");
  };

  const handleShowSource = () => {
    let tab = [];
    if (textSources.length > 0 && textSources[0].length > 0) {
      tab.push({ tab: "TEXT", label: "Texte manuel", items: textSources });
    }
    if (linkSources[0]?.content.length > 0) {
      tab.push({ tab: "LINK", label: "Lien web", items: linkSources });
    }
    if (blogSources[0]?.article) {
      tab.push({ tab: "BLOG", label: "Blog", items: blogSources });
    }
    if (eventSources[0]?.event) {
      tab.push({ tab: "EVENT", label: "Event", items: eventSources });
    }
    if (tab.length > 0) {
      setCurrentType(tab[0].tab);
      setCurrentIndex(0);
    }
    setSourcesData(tab);
    setIsOpenSourceModal(true);
  };

  const getSourceContent = (i) => {
    if (i.tab === "TEXT") {
      return (
        <div
          className={styles.resultContainer}
          dangerouslySetInnerHTML={{
            __html: i.items[currentIndex] ?? "",
          }}
        ></div>
      );
    } else if (i.tab === "LINK") {
      return (
        <>
          <p className={styles.resultLink}>
            {i.items[currentIndex]?.link ?? ""}
          </p>
          <div
            className={styles.resultContainer}
            dangerouslySetInnerHTML={{
              __html: i.items[currentIndex]?.content ?? "",
            }}
          ></div>
        </>
      );
    } else if (i.tab === "BLOG") {
      return (
        <div className={`${styles.itemResult} `}>
          <div>{i.items[currentIndex].article.title}</div>
        </div>
      );
    } else if (i.tab === "EVENT") {
      const nameAttr = `name${lng.charAt(0).toUpperCase() + lng.slice(1)}`;
      return (
        <div className={`${styles.itemResult} `}>
          <div>{i.items[currentIndex].event[nameAttr]}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <h2 className={styles.title}>
        <img src={cockpitLogo} alt="NACN AI" width={30} />
        Générer un article complet
      </h2>

      <div className={styles.container}>
        {step === "SOURCE" && (
          <>
            <h3>Sources de l’article :</h3>

            <ul className={styles.tabs}>
              <li
                onClick={() => {
                  setCurrentIndex(0);
                  setCurrentType("TEXT");
                }}
                className={`${styles.tabs_item} ${
                  currentType === "TEXT" && styles.active
                }`}
              >
                Texte manuel
              </li>
              <li
                onClick={() => {
                  setCurrentIndex(0);
                  setCurrentType("LINK");
                }}
                className={`${styles.tabs_item} ${
                  currentType === "LINK" && styles.active
                }`}
              >
                Lien web
              </li>
              <li
                onClick={() => {
                  setCurrentIndex(0);
                  setCurrentType("BLOG");
                }}
                className={`${styles.tabs_item} ${
                  currentType === "BLOG" && styles.active
                }`}
              >
                Blog
              </li>
              <li
                onClick={() => {
                  setCurrentIndex(0);
                  setCurrentType("EVENT");
                }}
                className={`${styles.tabs_item} ${
                  currentType === "EVENT" && styles.active
                }`}
              >
                Event
              </li>
            </ul>

            {currentType === "TEXT" && (
              <TextSource
                textSources={textSources}
                setTextSources={setTextSources}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />
            )}

            {currentType === "LINK" && (
              <LinkSource
                linkSources={linkSources}
                setLinkSources={setLinkSources}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                token={token}
                apiUrl={apiUrl}
                aiUrl={aiUrl}
              />
            )}

            {currentType === "BLOG" && (
              <BlogSource
                blogSources={blogSources}
                setBlogSources={setBlogSources}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                lng={lng}
                blogSearchUrl={blogSearchUrl}
                organizationId={organizationId}
              />
            )}

            {currentType === "EVENT" && (
              <EventSource
                token={token}
                apiUrl={apiUrl}
                eventSources={eventSources}
                setEventSources={setEventSources}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                lng={lng}
                organizationId={organizationId}
              />
            )}

            <div className={styles.article_actions}>
              <div className={styles.article_actions_left}>
                <label>Contexte:</label>
                <div className={styles.article_actions_left_select}>
                  <Select
                    menuPlacement="top"
                    defaultValue={selectedOption}
                    onChange={setSelectedOption}
                    options={[
                      { value: "standard", label: "Prompt standard" },
                      { value: "prompt2", label: "Titre prompt 2" },
                      { value: "prompt3", label: "Titre prompt 3" },
                      { value: "prompt4", label: "Titre prompt 4" },
                    ]}
                  />
                </div>
              </div>
              <div className={styles.article_actions_right}>
                {isFetching ? (
                  <button
                    className="gradientBtn"
                    style={{
                      paddingTop: "12px",
                      paddingBottom: "12px",
                    }}
                    disabled
                  >
                    <Loader
                      style={{
                        height: "10px",
                      }}
                      color={"#fff"}
                    />
                  </button>
                ) : (
                  <button
                    className="gradientBtn"
                    onClick={handleGenerateText}
                    // disabled={!selectedPrompt || inputValue.length === 0}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                    >
                      <path
                        d="M13.3327 1.83363V4.50029M14.666 3.16696H11.9993M7.34398 2.37629C7.37255 2.22336 7.4537 2.08524 7.57338 1.98584C7.69307 1.88644 7.84374 1.83203 7.99932 1.83203C8.15489 1.83203 8.30557 1.88644 8.42525 1.98584C8.54494 2.08524 8.62609 2.22336 8.65465 2.37629L9.35532 6.08163C9.40508 6.34506 9.5331 6.58737 9.72267 6.77694C9.91224 6.96651 10.1546 7.09453 10.418 7.14429L14.1233 7.84496C14.2762 7.87353 14.4144 7.95468 14.5138 8.07436C14.6132 8.19404 14.6676 8.34472 14.6676 8.50029C14.6676 8.65587 14.6132 8.80655 14.5138 8.92623C14.4144 9.04591 14.2762 9.12706 14.1233 9.15563L10.418 9.85629C10.1546 9.90606 9.91224 10.0341 9.72267 10.2236C9.5331 10.4132 9.40508 10.6555 9.35532 10.919L8.65465 14.6243C8.62609 14.7772 8.54494 14.9154 8.42525 15.0147C8.30557 15.1141 8.15489 15.1686 7.99932 15.1686C7.84374 15.1686 7.69307 15.1141 7.57338 15.0147C7.4537 14.9154 7.37255 14.7772 7.34398 14.6243L6.64332 10.919C6.59355 10.6555 6.46553 10.4132 6.27596 10.2236C6.0864 10.0341 5.84408 9.90606 5.58065 9.85629L1.87532 9.15563C1.72239 9.12706 1.58426 9.04591 1.48486 8.92623C1.38547 8.80655 1.33105 8.65587 1.33105 8.50029C1.33105 8.34472 1.38547 8.19404 1.48486 8.07436C1.58426 7.95468 1.72239 7.87353 1.87532 7.84496L5.58065 7.14429C5.84408 7.09453 6.0864 6.96651 6.27596 6.77694C6.46553 6.58737 6.59355 6.34506 6.64332 6.08163L7.34398 2.37629ZM3.99932 13.8336C3.99932 14.57 3.40236 15.167 2.66598 15.167C1.9296 15.167 1.33265 14.57 1.33265 13.8336C1.33265 13.0972 1.9296 12.5003 2.66598 12.5003C3.40236 12.5003 3.99932 13.0972 3.99932 13.8336Z"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>{" "}
                    Générer l'article
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {step === "RESULT" && (
          <div>
            <div className={styles.result_top}>
              <div className={styles.result_top_left}>
                <span>Article:</span>
                <Select
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e)}
                  options={resultVersions}
                  styles={{
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

              <div className={styles.result_top_right}>
                Sources:{" "}
                <span onClick={handleShowSource} className={styles.pointer}>
                  <IconEye />
                </span>
              </div>
            </div>

            <div
              className={styles.resultContainer}
              dangerouslySetInnerHTML={{
                __html: selectedVersion ? selectedVersion.content : "",
              }}
            ></div>

            {selectedVersion &&
              (!selectedVersion.isUsed ? (
                <div className={styles.result_actions}>
                  <button className="primaryBtn" onClick={handleClick}>
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

            {selectedVersion?.isUsed && (
              <div className={styles.update_instruction_alt}>
                <h3 className={styles.subtitle}>Désirez-vous autre chose ?</h3>
                <div className={styles.update_instruction_alt_actions}>
                  <button>Générer un titre</button>
                  <button onClick={showPictureStep}>Générer une image</button>
                  <button>Générer un post LinkedIn</button>
                </div>
              </div>
            )}

            <Modal
              isOpen={isOpenSourceModal}
              className={{
                base: modalStyles.modalContent,
                afterOpen: modalStyles.modalContentAfterOpen,
                beforeClose: modalStyles.modalContentBeforeClose,
              }}
              overlayClassName={modalStyles.modalOverlay}
            >
              <div className={modalStyles.modal}>
                <div className={modalStyles.modal_header}>
                  <div className={modalStyles.modal_header_left}>
                    <IconEyeSource />
                    <h3 className={styles.modal_title}>Sources :</h3>
                    <ul className={styles.tabs}>
                      {sourcesData.map((i, index) => {
                        return (
                          <li
                            key={i.tab}
                            onClick={() => {
                              setCurrentIndex(0);
                              setCurrentType(i.tab);
                            }}
                            className={`${styles.tabs_item} ${
                              currentType === i.tab && styles.active
                            }`}
                          >
                            {i.label}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className={modalStyles.modal_header_right}>
                    <span
                      className={modalStyles.modal_header_edit}
                      onClick={() => setIsOpenConfirmSourceModal(true)}
                    >
                      <IconPencil />
                    </span>
                    <span className={modalStyles.modal_header_sep}></span>
                    <span
                      className={modalStyles.modal_close}
                      onClick={() => setIsOpenSourceModal(false)}
                    >
                      <IconClose size={20} />
                    </span>
                  </div>
                </div>

                <div>
                  {sourcesData.map((i) => {
                    if (i.tab !== currentType) {
                      return null;
                    }
                    return (
                      <>
                        <ul className={styles.alt_tabs}>
                          {i.items.map((item, index) => (
                            <li
                              className={`${styles.alt_tabs_item} ${
                                currentIndex === index && styles.active
                              }`}
                              key={index}
                              onClick={() => {
                                setCurrentIndex(index);
                              }}
                            >
                              {i.label} {index + 1}{" "}
                            </li>
                          ))}
                        </ul>

                        {getSourceContent(i)}
                      </>
                    );
                  })}
                </div>
              </div>
            </Modal>

            <Modal
              isOpen={isOpenConfirmSourceModal}
              className={{
                base: modalStyles.modalContent,
                afterOpen: modalStyles.modalContentAfterOpen,
                beforeClose: modalStyles.modalContentBeforeClose,
              }}
              overlayClassName={modalStyles.modalOverlay}
            >
              <div className={`${modalStyles.modal} ${modalStyles.smModal}`}>
                <div className={modalStyles.modal_confirm_icon}>
                  <IconPencil size={30} />
                </div>
                <p className={modalStyles.modal_confirm_title}>
                  Voulez-vous vraiment modifier les sources ?
                </p>
                <p className={modalStyles.modal_confirm_txt}>
                  Toutes les versions générées à partir de ces sources seront
                  supprimées.
                </p>

                <div className={modalStyles.modal_confirm_actions}>
                  <button
                    className={`${modalStyles.btn} ${modalStyles.btn_alt}`}
                    onClick={() => setIsOpenConfirmSourceModal(false)}
                  >
                    Annuler
                  </button>
                  <button
                    className={`${modalStyles.btn} ${modalStyles.btn_black}`}
                    onClick={() => {
                      setStep("SOURCE");
                      setIsOpenConfirmSourceModal(false);
                      setIsOpenSourceModal(false);
                    }}
                  >
                    Oui, modifier
                  </button>
                </div>
              </div>
            </Modal>

            {/* <Modal
              closable={false}
              open={isOpenSourceModal}
              mask={{ blur: false }}
              maskClosable={false}
              width="50vw"
              height="50vh"
              footer={null}
              onCancel={() => setIsOpenSourceModal(false)}
              destroyOnHidden={true}
              zIndex="999999"
              styles={{ body: { padding: "0" } }}
            >
              <div className={modalStyles.modal_header}>
                <div className={modalStyles.modal_header_left}>
                  <IconEyeSource />
                  <h3 className={styles.modal_title}>Sources :</h3>
                  <ul className={styles.tabs}>
                    {sourcesData.map((i, index) => {
                      return (
                        <li
                          key={i.tab}
                          onClick={() => {
                            setCurrentIndex(0);
                            setCurrentType(i.tab);
                          }}
                          className={`${styles.tabs_item} ${
                            currentType === i.tab && styles.active
                          }`}
                        >
                          {i.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className={modalStyles.modal_header_right}>
                  <span
                    className={modalStyles.modal_header_edit}
                    onClick={() => setIsOpenConfirmSourceModal(true)}
                  >
                    <IconPencil />
                  </span>
                  <span className={modalStyles.modal_header_sep}></span>
                  <span
                    className={modalStyles.modal_close}
                    onClick={() => setIsOpenSourceModal(false)}
                  >
                    <IconClose size={20} />
                  </span>
                </div>
              </div>

              <div>
                {sourcesData.map((i) => {
                  if (i.tab !== currentType) {
                    return null;
                  }
                  return (
                    <>
                      <ul className={styles.alt_tabs}>
                        {i.items.map((item, index) => (
                          <li
                            className={`${styles.alt_tabs_item} ${
                              currentIndex === index && styles.active
                            }`}
                            key={index}
                            onClick={() => {
                              setCurrentIndex(index);
                            }}
                          >
                            {i.label} {index + 1}{" "}
                          </li>
                        ))}
                      </ul>

                      {getSourceContent(i)}
                    </>
                  );
                })}
              </div>
            </Modal>

            <Modal
              closable={false}
              open={isOpenConfirmSourceModal}
              mask={{ blur: false }}
              maskClosable={false}
              width="600px"
              // height="50vh"
              footer={null}
              onCancel={() => setIsOpenConfirmSourceModal(false)}
              destroyOnHidden={true}
              zIndex="9999990"
              styles={{ body: { padding: "0" } }}
            >
              <div className={modalStyles.modal_confirm_icon}>
                <IconPencil size={30} />
              </div>
              <p className={modalStyles.modal_confirm_title}>
                Voulez-vous vraiment modifier les sources ?
              </p>
              <p className={modalStyles.modal_confirm_txt}>
                Toutes les versions générées à partir de ces sources seront
                supprimées.
              </p>

              <div className={modalStyles.modal_confirm_actions}>
                <button
                  className={`${modalStyles.btn} ${modalStyles.btn_alt}`}
                  onClick={() => setIsOpenConfirmSourceModal(false)}
                >
                  Annuler
                </button>
                <button
                  className={`${modalStyles.btn} ${modalStyles.btn_black}`}
                  onClick={() => {
                    setStep("SOURCE");
                    setIsOpenConfirmSourceModal(false);
                    setIsOpenSourceModal(false);
                  }}
                >
                  Oui, modifier
                </button>
              </div>
            </Modal> */}
          </div>
        )}
      </div>
    </>
  );
};

export default SourceStep;
