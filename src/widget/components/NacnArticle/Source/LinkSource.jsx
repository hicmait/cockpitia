import { useState } from "react";

import { tamtamIt } from "../../../api";
import styles from "../NacnArticle.module.scss";
import IconLink from "../../../icons/IconLink";
import IconSpinner from "../../../icons/IconSpinner";
import IconPlus from "../../../icons/IconPlus";
import IconTrash from "../../../icons/IconTrash";

const LinkSource = ({
  token,
  apiUrl,
  aiUrl,
  linkSources,
  setLinkSources,
  currentIndex,
  setCurrentIndex,
}) => {
  const [isParsing, setIsParsing] = useState(false);

  const handleTamtamIt = () => {
    if (linkSources[currentIndex].link.length === 0) {
      return null;
    }
    setIsParsing(true);
    let url = linkSources[currentIndex].link;
    let urlHasProtocolHttp = url.toLowerCase().startsWith("http");
    if (!urlHasProtocolHttp) {
      url = "http://" + url;
    }
    tamtamIt(apiUrl, token, url)
      .then((resp) => {
        if (resp.data.data) {
          let { provided_url, url_information } = resp.data.data;
          if (url_information.description) {
            let txt = "";
            if (url_information.title) {
              txt += url_information.title + "\n";
            }
            txt += url_information.description;

            const tab = [...linkSources];
            tab[currentIndex].content = txt;
            setLinkSources(tab);
          }
        }
      })
      .finally(() => setIsParsing(false));
  };

  return (
    <div>
      <ul className={styles.alt_tabs}>
        {linkSources.map((i, index) => (
          <li
            className={`${styles.alt_tabs_item} ${
              currentIndex === index && styles.active
            }`}
            key={index}
            onClick={() => {
              setCurrentIndex(index);
            }}
          >
            Lien {index + 1}{" "}
            {index > 0 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  let tab = [...linkSources];
                  const removed = tab.splice(index, 1);
                  setLinkSources(tab);
                  setCurrentIndex(0);
                }}
              >
                <IconTrash />
              </span>
            )}
          </li>
        ))}
        <li
          className={styles.tab_plus}
          onClick={() => {
            setLinkSources([...linkSources, { link: "", content: "" }]);
            setCurrentIndex(linkSources.length);
          }}
        >
          <IconPlus />
        </li>
      </ul>

      <div className={styles.tamtamIt}>
        <input
          type="text"
          className={styles.textContent}
          value={linkSources[currentIndex].link}
          onChange={(e) => {
            const tab = [...linkSources];
            tab[currentIndex].link = e.target.value;
            setLinkSources(tab);
          }}
        />
        <button className="defaultBtn" onClick={handleTamtamIt}>
          {isParsing ? (
            <span className={styles.spinner}>
              <IconSpinner size="20" />
            </span>
          ) : (
            <IconLink />
          )}
        </button>
      </div>

      <textarea
        className={`${styles.textContent} ${styles.textarea} `}
        rows="10"
        value={linkSources[currentIndex].content}
        disabled
      ></textarea>
    </div>
  );
};

export default LinkSource;
