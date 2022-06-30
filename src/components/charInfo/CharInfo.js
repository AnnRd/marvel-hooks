import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Sceleton from '../skeleton/Skeleton'

import './charInfo.scss';

const CharInfo = (props) => {
    const [character, setCharacter] = useState(null);

    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])

    const updateChar = () => {
        const {charId} = props;

        if (!charId) {
            return;
        }

        clearError(); //если появилась ошибка, она очистится перед новым запросом
        getCharacter(charId)
            .then(onCharLoaded);
    }

    const onCharLoaded = (character) => {
        setCharacter(character);
    }

        const skeleton = character || loading || error ? null : <Sceleton/>; // "заглушка" пока не выбран никакой персонаж из charList
        const content = !loading && !error && character ? <View character={character}/> : null;
        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error? <ErrorMessage/> : null;

        return (
            <div className="char__info">
                {skeleton}
                {content}
                {spinner}
                {errorMessage}
            </div>
        )
}

const View = ({character}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = character;
    const notAvailableImg = thumbnail.includes('image_not_available');

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={{objectFit: notAvailableImg ? 'contain' : 'cover'}}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
               {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There`s no comics with this character.'}
                {
                    comics.map( (item, i) => {
                        if (i > 9) {
                            return;
                        }

                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;