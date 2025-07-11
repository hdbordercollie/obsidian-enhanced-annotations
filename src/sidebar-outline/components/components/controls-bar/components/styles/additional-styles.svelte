<script lang="ts">
    import LabeledAnnotations from '../../../../../../main';
    import MultiOptionsToggleButton from './multi-option-toggle-button.svelte';
    import { Case, FontFamily, FontWeight, LabelSettings, Opacity } from '../../../../../../settings/settings-type';
    import { TextSVG } from '../../../../../../settings/settings-tab/components/label-settings/components/text-svg';
    import { ChevronDown, ChevronUp, Italic, Trash2, Underline } from 'lucide-svelte';
    import { l } from '../../../../../../lang/lang';
    import ToggleButton from './toggle-button.svelte';
    import SquareButton from './square-button.svelte';
    import { getDefaultColor } from '../../../../../../settings/helpers/get-default-color';

    export let plugin: LabeledAnnotations;
    export let label: LabelSettings;
    export let onToggleAdditionalSettings: () => void;
    export let showAdditionalSettings = false;

    const onColorChange = (e: any) => {
        const value = e.target.value;
        plugin.settings.dispatch({
            payload: {
                id: label.id,
                color: value,
            },
            type: 'SET_COLOR',
        });
    };

    let underline = Boolean(label.style.underline);
    const onToggleUnderline = () => {
        underline = !label.style.underline;
        plugin.settings.dispatch({
            payload: {
                id: label.id,
                underline: underline,
            },
            type: 'SET_LABEL_UNDERLINE',
        });
    };

    let italic = Boolean(label.style.italic);
    const onToggleItalic = () => {
        italic = !label.style.italic;
        plugin.settings.dispatch({
            payload: {
                id: label.id,
                italic: italic,
            },
            type: 'SET_LABEL_ITALIC',
        });
    };

    const fontFamilies = (
        ['sans-serif', 'serif', 'monospace'] as FontFamily[]
    ).map((f) => ({
        value: f as FontFamily,
        iconHtml: TextSVG('F', {
            fontFamily: f as FontFamily,
        }),
    }));
    const onFontFamilyChange = (value: FontFamily) => {
        plugin.settings.dispatch({
            payload: {
                id: label.id,
                family: value,
            },
            type: 'SET_LABEL_FONT_FAMILY',
        });
    };

    const fontWeights = [
        {
            value: 'thin' as FontWeight,
            iconHtml: TextSVG('B', { fontWeight: 400 }),
        },
        {
            value: 'bold' as FontWeight,
            iconHtml: TextSVG('B', { fontWeight: 600 }),
        },
    ];
    const onFontWeightChange = (value: FontWeight) => {
        plugin.settings.dispatch({
            payload: {
                id: label.id,
                weight: value,
            },
            type: 'SET_LABEL_FONT_WEIGHT',
        });
    };

    const labelCases = [
        {
            iconName: 'case-sensitive' as const,
            value: 'title',
        },
        {
            iconName: 'case-upper' as const,
            value: 'upper',
        },
        {
            iconName: 'case-lower' as const,
            value: 'lower',
        },
    ];
    const onLabelCaseChange = (value: string) =>
        plugin.settings.dispatch({
            type: 'SET_LABEL_CASE',
            payload: {
                id: label.id,
                case: value as Case,
            },
        });

    const fontSizes = [12, 16, 20, 24, 32].map((n) => ({
        name: n + 'px',
        value: n,
        iconHtml: TextSVG(String(n)),
    }));
    const onFontSizeChange = (value: number) =>
        plugin.settings.dispatch({
            type: 'SET_LABEL_FONT_SIZE',
            payload: { id: label.id, fontSize: value },
        });

    const fontOpacities = ([80, 60, 40, 20] as Opacity[]).map((n) => ({
        name: n + '%',
        value: n,
        iconHtml: TextSVG(String(n)),
    }));
    const onFontOpacityChange = (value: Opacity) =>
        plugin.settings.dispatch({
            type: 'SET_LABEL_FONT_OPACITY',
            payload: { id: label.id, opacity: value as Opacity },
        });

    const onDelete = () => {
        plugin.settings.dispatch({
            payload: { id: label.id },
            type: 'DELETE_GROUP',
        });
    };
</script>

<div class={`additional-settings `}>
    <div class="settings-row">
        <input
            aria-label="Press `shift` + `left click` for a random color"
            on:change={onColorChange}
            on:click={(e) => {
                if (e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.value = getDefaultColor(
                        plugin.settings.getValue(),
                    );
                    onColorChange(e);
                }
            }}
            type="color"
            value={label.style.color || ''}
        />

        <MultiOptionsToggleButton
            props={{
                onChange: onFontOpacityChange,
                options: fontOpacities,
                value: label.style.opacity,
                name: 'Opacity',
            }}
        />
        <MultiOptionsToggleButton
            props={{
                onChange: onFontSizeChange,
                options: fontSizes,
                value: label.style.fontSize,
                name: 'Font size',
            }}
        />

        <SquareButton
            label={showAdditionalSettings ? l.COLLAPSE : l.EXPAND}
            onClick={onToggleAdditionalSettings}
        >
            {#if showAdditionalSettings}
                <ChevronUp size={18} />
            {:else}
                <ChevronDown size={18} />
            {/if}
        </SquareButton>
    </div>

    {#if showAdditionalSettings}
        <div class="settings-row">
            <ToggleButton
                enabled={italic}
                label="Italic"
                onClick={onToggleItalic}
            >
                <Italic size={18} />
            </ToggleButton>

            <MultiOptionsToggleButton
                props={{
                    name: 'Font weight',
                    options: fontWeights,
                    value: label.style.fontWeight,
                    onChange: onFontWeightChange,
                }}
            />
            <ToggleButton
                enabled={underline}
                label="Underline"
                onClick={onToggleUnderline}
            >
                <Underline size={18} />
            </ToggleButton>

            <SquareButton
                label={l.SETTINGS_LABELS_STYLES_DELETE_STYLE}
                onClick={onDelete}
            >
                <Trash2 size={18} color="red" />
            </SquareButton>
        </div>
        <div class="settings-row">
            <MultiOptionsToggleButton
                props={{
                    name: 'Font family',
                    options: fontFamilies,
                    value: label.style.fontFamily,
                    onChange: onFontFamilyChange,
                }}
            />
            <MultiOptionsToggleButton
                props={{
                    options: labelCases,
                    value: label.style.case,
                    name: 'Case',
                    onChange: onLabelCaseChange,
                }}
            />
        </div>
    {/if}
</div>

<style>
    .additional-settings {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .settings-row {
        display: flex;
        align-items: center;
        gap: 5px;
    }
</style>
