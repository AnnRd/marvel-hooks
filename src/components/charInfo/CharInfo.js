import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './charInfo.scss';

const CharInfo = (props) => {
    const [character, setCharacter] = useState(null);

    const {loading, error, getCharacter, clearError, process, setProcess} = useMarvelService();
    //в зависимости от process будут рендерится разные кусочки интерфейса: заглушка, загрузка, ошибка или контент

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
            .then(onCharLoaded)
            .then(() => setProcess('confirmed')); // состояние "подтвержденного" запроса. только когда данные уже установятся в стейт, можем передать, что в компоненте все ок, данные "подтверждены", тк действия асинхронные
    }

    const onCharLoaded = (character) => {
        setCharacter(character);
    }

        return (
            <div className="char__info">
                {setContent(process, View, character)}
            </div>
        )
}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;
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