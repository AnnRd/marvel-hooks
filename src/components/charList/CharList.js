import { useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {
    const [charList, setCharList] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charListEnd, setCharListEnd] = useState(false);
    const [selected, setSelected] = useState(null); //для активного стиля

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []); //пустой массив для отслеживания - функция выполнится только один раз -- при создании компонента.Имитация componentDidMount. useEffect вызыввается после рендера всего.

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true); //если initial = true, то загрузка первичная и setNewItemsLoading(false) должно остатьс в false

        getAllCharacters(offset)
            .then(onCharLoaded)
    }

    const onCharLoaded = (newCharList) => {
        let end = false;
        if (newCharList.length < 9) {
            end = true;
        }

        setCharList(charList => [...charList, ...newCharList]); //развернула старый массив персонажей и за ним добавила новый. При первичной загрузке charlist - пустой массив
        setNewItemsLoading(newItemsLoading => false);
        setOffset(offset => offset + 9);
        setCharListEnd(charListEnd => end);
    }

    const handleClick = ()  => {
        setSelected(selected => props.charId);
      }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderCharacters(arr) {
        const characters = arr.map( (obj, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (obj.thumbnail.includes('image_not_available')) {
                imgStyle = {'objectFit' : 'unset'};
            }            
            
            return (
                <CSSTransition key={obj.id} timeout={500} classNames="char__item">
                    <li 
                        className="char__item"
                        tabIndex={0}
                        ref={el => itemRefs.current[i] = el}
                        onClick={() => {
                            handleClick();
                            props.onCharSelected(obj.id);
                            focusOnItem(i);
                        }}
                        onKeyPress={(event) => {
                            if (event.key === ' ' || event.key === "Enter") {
                                props.onCharSelected(obj.id);
                                focusOnItem(i);
                            }
                        }}>
                            <img src={obj.thumbnail} alt={obj.name} style={imgStyle}/>
                            <div className="char__name">{obj.name}</div>
                    </li>
                </CSSTransition>
            )
            
        });

        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {characters}
                </TransitionGroup>
            </ul> //Для центровки спиннера/ошибки
        )
    }
        
    const items = renderCharacters(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemsLoading ? <Spinner/> : null; //если есть загрузка, но это не загрузка новых персонажей

    return (
        <div className="char__list">
                {items}
                {spinner}
                {errorMessage}
            <button
            className="button button__main button__long"
            disabled={newItemsLoading}
            style={{'display': charListEnd ? 'none' : 'block'}}
            onClick={() => {onRequest(offset)}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )   
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;