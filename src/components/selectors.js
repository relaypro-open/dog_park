import {createSelector} from 'reselect';
import {property, union} from 'lodash/fp';
import {languages} from 'lang-map';
import parsePath from 'path-parse';
import {addStubHunk} from 'react-diff-view';

export const createFilenameSelector = () => createSelector(
    property('type'), property('oldPath'), property('newPath'),
    (type, oldPath, newPath) => type === 'delete' ? oldPath : newPath
);

export const createCanExpandSelector = computeFilename => createSelector(
    computeFilename,
    filename => filename === 'src/addons/link/ReactLink.js'
);

export const createCustomClassNamesSelector = computeFilename => createSelector(
    computeFilename,
    filename => {
        const {ext = ''} = parsePath(filename);
        const [language] = languages(ext);
        return {
            code: `language-${language || 'unknown'}`
        };
    }
);

export const createCustomEventsSelector = computeExpandable => createSelector(
    computeExpandable, property('addComment'), property('selectChange'), property('loadCollapsedBefore'),
    (canExpand, addComment, selectChange, loadCollapsedBefore) => {
        const baseEvents = {
            code: {
                onDoubleClick: addComment
            },
            gutter: {
                onClick: selectChange
            }
        };

        return canExpand
            ? {
                ...baseEvents,
                gutterHeader: {
                    onClick: loadCollapsedBefore
                }
            }
            : baseEvents;
    }
);

export const createRenderingHunksSelector = computeExpandable => createSelector(
    computeExpandable, property('hunks'),
    (canExpand, hunks) => (canExpand ? addStubHunk(hunks) : hunks)
);

export const createWidgetsSelector = createWidget => createSelector(
    property('comments'), property('writingChanges'),
    (comments, writingChanges) => {
        const changeKeys = union(Object.keys(comments), writingChanges);

        return changeKeys.reduce(
            (widgets, key) => {
                const lineComments = comments[key] || [];
                const writing = writingChanges.includes(key);

                return {
                    ...widgets,
                    [key]: createWidget(key, lineComments, writing)
                };
            },
            {}
        );
    }
);
