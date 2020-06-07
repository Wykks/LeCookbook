import type { CKEditor5 } from '@ckeditor/ckeditor5-angular';

export const ckeditorConfig: CKEditor5.Config = {
  language: 'fr',
  removePlugins: [
    'CKFinderUploadAdapter',
    'EasyImage',
    'Image',
    'ImageCaption',
    'ImageStyle',
    'ImageToolbar',
    'ImageUpload',
    'MediaEmbed',
    'Table',
    'TableToolbar',
    'BlockQuote',
  ],
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    '|',
    'bulletedList',
    'numberedList',
    '|',
    'indent',
    'outdent',
    '|',
    'link',
    '|',
    'undo',
    'redo',
  ],
  link: {
    addTargetToExternalLinks: true,
  },
};
