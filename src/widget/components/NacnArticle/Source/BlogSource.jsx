import { useState } from "react";
import debounce from "lodash.debounce";

import { fetchSearch } from "../../../api";
import styles from "../NacnArticle.module.scss";
import IconLink from "../../../icons/IconLink";
import IconSpinner from "../../../icons/IconSpinner";
import IconPlus from "../../../icons/IconPlus";
import IconTrash from "../../../icons/IconTrash";
import IconCheck from "../../../icons/IconCheck";
import IconClose from "../../../icons/IconClose";

const BlogSource = ({
  blogSearchUrl,
  organizationId,
  lng,
  blogSources,
  setBlogSources,
  currentIndex,
  setCurrentIndex,
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [highlightedTags, setHighlightedTags] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [results, setResults] = useState({ article: [] });

  const groupResultsByEntities = (results, entities) => {
    let groups = {};
    entities.forEach((entity) => (groups[entity] = []));

    let tags = [];
    for (let i = 0; i < results.length; i++) {
      let document = results[i];
      let entityName = document.entity;
      if (entities.includes(entityName)) {
        if (entityName === "tag") {
          groups[entityName].push(document.tagName);
        } else {
          groups[entityName].push(document);
        }
      }
    }
    return groups;
  };

  const debouncedSearchLoadResults = debounce((search) => {
    setIsFetching(true);
    fetchSearch(blogSearchUrl, search, lng, [organizationId])
      .then((resp) => {
        if (resp.data.data.length > 0) {
          const groupedResults = groupResultsByEntities(resp.data.data, [
            "article",
            "tag",
          ]);
          setResults(groupedResults);
          let tabs = [];
          if (groupedResults.article?.length > 0) {
            tabs.push("Article");
          }
          if (groupedResults.tag?.length > 0) {
            setHighlightedTags(groupedResults.tag);
          }
          setIsFetched(true);
        } else if (resp.error) {
          setResults({});
        }
        setIsFetching(false);
      })
      .catch(() => {
        if (!e?.response?.status === 700) {
          setIsFetching(false);
          setResults({});
        }
      });
  }, 1000);

  const handleSearchChange = (e) => {
    const tab = [...blogSources];
    tab[currentIndex].search = e.target.value;
    setBlogSources(tab);

    if (e.target.value.length > 2) {
      debouncedSearchLoadResults(e.target.value);
    } else {
      setResults({});
      setHighlightedTags([]);
      setIsFetched(false);
    }
  };

  return (
    <div>
      <ul className={styles.alt_tabs}>
        {blogSources.map((i, index) => (
          <li
            className={`${styles.alt_tabs_item} ${
              currentIndex === index && styles.active
            }`}
            key={index}
            onClick={() => {
              setCurrentIndex(index);
            }}
          >
            Blog {index + 1}{" "}
            {index > 0 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  let tab = [...blogSources];
                  const removed = tab.splice(index, 1);
                  setBlogSources(tab);
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
            setBlogSources([...blogSources, { search: "", article: null }]);
            setCurrentIndex(blogSources.length);
          }}
        >
          <IconPlus />
        </li>
      </ul>

      {!blogSources[currentIndex]?.article && (
        <div className={styles.tamtamIt}>
          <input
            type="text"
            placeholder="Rechecher par titre ou tag"
            className={styles.textContent}
            value={blogSources[currentIndex].search}
            onChange={handleSearchChange}
          />
          {/* <button className="defaultBtn" onClick={handleTamtamIt}>
          {isParsing ? (
            <span className={styles.spinner}>
              <IconSpinner size="20" />
            </span>
          ) : (
            <IconLink />
          )}
        </button> */}
        </div>
      )}

      <div className={styles.resultContainer}>
        {isFetching ? (
          <div className={styles.spinner}>
            <IconSpinner size="20" />
          </div>
        ) : (
          <div className={styles.results}>
            {isFetched && results?.article?.length === 0 && (
              <div className="results__not-found">
                Votre recherche ne correspond à aucun document.
              </div>
            )}

            {blogSources[currentIndex]?.article ? (
              <div className={`${styles.itemResult} ${styles.active}`}>
                <div>{blogSources[currentIndex].article.title}</div>
                <span
                  className={styles.itemResult_check_icon}
                  onClick={(e) => {
                    const tab = [...blogSources];
                    tab[currentIndex].article = null;
                    setBlogSources(tab);
                    setIsFetched(false);
                  }}
                >
                  <span className={styles.itemResult_check_icon_1}>
                    <IconCheck size={20} />
                  </span>
                  <span className={styles.itemResult_check_icon_2}>
                    <IconClose size={20} />
                  </span>
                </span>
              </div>
            ) : (
              isFetched && (
                <>
                  <h3 className={styles.subtitle}>Articles trouvés :</h3>
                  <div>
                    {results?.article?.map((i) => (
                      <div key={i.id} className={`${styles.itemResult} `}>
                        <div>{i.title}</div>
                        <span
                          className={styles.itemResult_add_icon}
                          onClick={(e) => {
                            const tab = [...blogSources];
                            tab[currentIndex].article = i;
                            tab[currentIndex].search = "";
                            setBlogSources(tab);
                            setResults({});
                          }}
                        >
                          <IconPlus size={20} />
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogSource;
