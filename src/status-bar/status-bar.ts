import LabeledAnnotations from '../main';
import { fileAnnotations } from '../sidebar-outline/components/components/annotations-list/annotations-list.store';
import { Annotation } from '../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';
import { pluralize } from '../helpers/pluralize';
import { get } from 'svelte/store';
import { TFile } from 'obsidian';
import { createTooltip } from './helpers/create-tooltip';
import { displayNone } from './helpers/class-names';

export class StatusBar {
    private elements: {
        comments: HTMLElement;
        highlights: HTMLElement;
        container: HTMLElement;
    };

    constructor(private plugin: LabeledAnnotations) {
        this.onLoad();
    }

    private onLoad = () => {
        const container = this.plugin.addStatusBarItem();
        this.elements = {
            container,
            comments: container.createEl('span'),
            highlights: container.createEl('span'),
        };
        this.elements.container.addClass(
            'mod-clickable',
            'enhanced-annotations__status',
        );
        this.elements.container.onClickEvent(this.onClick);

        fileAnnotations.subscribe(async (v) => {
            const [comments, highlights] = Object.values(v.labels)
                .flat()
                .reduce(
                    (acc, v) => {
                        if (v.isHighlight) acc[1].push(v);
                        else acc[0].push(v);
                        return acc;
                    },
                    [[], []] as [Annotation[], Annotation[]],
                );
            this.resetTooltip();
            await this.updateText(comments, highlights);
        });
        this.elements.container.onmouseenter = this.onHover;
    };

    private updateTooltip = async (
        comments: Annotation[],
        highlights: Annotation[],
    ) => {
        let file: TFile | null | undefined;
        let text = '';

        if (comments.length | highlights.length) {
            file = this.plugin.outline.getValue().view?.file;
            if (file) text = await this.plugin.app.vault.read(file);
        }
        if (comments.length) {
            this.elements.comments.ariaLabel = await createTooltip(
                comments,
                text,
            );
        }
        if (highlights.length) {
            this.elements.highlights.ariaLabel = await createTooltip(
                highlights,
                text,
            );
        }
    };

    private resetTooltip() {
        this.elements.comments.ariaLabel = '';
        this.elements.highlights.ariaLabel = '';
    }

    private updateText = async (
        comments: Annotation[],
        highlights: Annotation[],
    ) => {
        const numberOfComments = comments.length;
        const numberOfHighlights = highlights.length;

        const noComments = numberOfComments === 0;
        const noHighlights = numberOfHighlights === 0;
        this.elements.comments.toggleClass(displayNone, noComments);
        this.elements.highlights.toggleClass(displayNone, noHighlights);
        this.elements.container.toggleClass(
            displayNone,
            noHighlights && noComments,
        );
        if (numberOfComments) {
            this.elements.comments.setText(
                `${pluralize(numberOfComments, 'comment', 'comments')}`,
            );
        }
        if (numberOfHighlights) {
            this.elements.highlights.setText(
                `${pluralize(numberOfHighlights, 'highlight', 'highlights')}`,
            );
        }
    };

    private onClick = async () => {
        await this.plugin.revealLeaf();
    };

    private onHover = async () => {
        const v = get(fileAnnotations);

        const [comments, highlights] = Object.values(v.labels)
            .flat()
            .reduce(
                (acc, v) => {
                    if (v.isHighlight) acc[1].push(v);
                    else acc[0].push(v);
                    return acc;
                },
                [[], []] as [Annotation[], Annotation[]],
            );
        await this.updateTooltip(comments, highlights);
    };
}
