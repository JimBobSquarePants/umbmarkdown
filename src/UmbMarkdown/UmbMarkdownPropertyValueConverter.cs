// <copyright file="UmbMarkdownPropertyValueConverter.cs" company="James Jackson-South">
// Copyright (c) James Jackson-South and contributors.
// Licensed under the Apache License, Version 2.0.
// </copyright>

namespace UmbMarkdown
{
    using System;
    using System.Web;
    using Markdig;
    using Umbraco.Core;
    using Umbraco.Core.Models.PublishedContent;
    using Umbraco.Core.PropertyEditors;
    using Umbraco.Web;
    using Umbraco.Web.Templates;

    /// <summary>
    /// Converts an object stored with the <see cref="Umbraco.Core.Models.IPublishedContent"/> into an instance of <see cref="HtmlString"/>.
    /// </summary>
    public class UmbMarkdownPropertyValueConverter : PropertyValueConverterBase, IPropertyValueConverterMeta
    {
        private readonly MarkdownPipeline pipeline;

        /// <summary>
        /// Initializes a new instance of the <see cref="UmbMarkdownPropertyValueConverter"/> class.
        /// </summary>
        public UmbMarkdownPropertyValueConverter()
        {
            // Configure the pipeline with all advanced extensions active
            this.pipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().Build();
        }

        /// <inheritdoc/>
        public override object ConvertDataToSource(PublishedPropertyType propertyType, object source, bool preview)
        {
            if (source == null)
            {
                return null;
            }

            var sourceString = source.ToString();

            // Ensures string is parsed for {localLink} and urls are resolved correctly
            if (UmbracoContext.Current != null)
            {
                sourceString = TemplateUtilities.ParseInternalLinks(sourceString);
                sourceString = TemplateUtilities.ResolveUrlsFromTextString(sourceString);
            }

            return sourceString;
        }

        /// <inheritdoc/>
        public override object ConvertSourceToObject(PublishedPropertyType propertyType, object source, bool preview)
        {
            if (source == null)
            {
                return new HtmlString(string.Empty);
            }

            var result = Markdown.ToHtml(source.ToString(), this.pipeline);
            if (UmbracoContext.Current != null)
            {
                result = TemplateUtilities.ParseInternalLinks(result);
                result = TemplateUtilities.ResolveUrlsFromTextString(result);
            }

            return new HtmlString(result);
        }

        /// <inheritdoc/>
        public override bool IsConverter(PublishedPropertyType propertyType)
        {
            return propertyType.PropertyEditorAlias.InvariantEquals("UmbMarkdown.MarkDownEditor");
        }

        /// <inheritdoc/>
        public Type GetPropertyValueType(PublishedPropertyType propertyType)
        {
            return typeof(IHtmlString);
        }

        /// <inheritdoc/>
        public PropertyCacheLevel GetPropertyCacheLevel(PublishedPropertyType propertyType, PropertyCacheValue cacheValue)
        {
            return PropertyCacheLevel.Content;
        }
    }
}