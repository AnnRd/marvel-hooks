import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './singleComicPage.scss';

const SingleComicPage = () => {
    const {comicId} = useParams(); //приходит из url
    const [comic, setComic] = useState(null); //comic - объект со всеми данными о комиксЕ
    const {loading, error, getComic, clearError} = useMarvelService();

    useEffect(() => {
        updateComic();
    }, [comicId])

    const updateComic = () => {
        clearError(); //если появилась ошибка, она очистится перед новым запросом
        getComic(comicId)
            .then(onComicLoaded);
    }

    const onComicLoaded = (comic) => {
        setComic(comic);
    }

    const content = !loading && !error && comic ? <View comic={comic}/> : null;
    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    return (
       <>
        {content}
        {spinner}
        {errorMessage}
       </>
    )

}

const View = ({comic}) => {
    const {name, description, pageCount, image, price, language} = comic;

    return (
        <div className="single-comic">
            <Helmet>
                <meta
                    name="description"
                    content={`${name} comics book`}
                />
                <title>{name}</title>
            </Helmet>
            <img src={image} alt={name} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{name}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;