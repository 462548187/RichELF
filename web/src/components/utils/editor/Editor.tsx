import React from "react";
import {useDispatch} from "react-redux";
import {Editor as TinyMCEEditor} from '@tinymce/tinymce-react';
import "tinymce/themes/silver/theme.min"
import "tinymce/icons/default/icons.min"
import "tinymce/plugins/autolink/plugin.min"
import "tinymce/plugins/link/plugin.min"
import "tinymce/plugins/codesample/plugin.min"
import "tinymce/plugins/directionality/plugin.min"
import "tinymce/plugins/emoticons/plugin.min"
import "tinymce/plugins/emoticons/js/emojis.min"
import "tinymce/plugins/charmap/plugin.min"
import "tinymce/plugins/fullscreen/plugin.min"
import "tinymce/plugins/help/plugin.min"
import "tinymce/plugins/hr/plugin.min"
import "tinymce/plugins/image/plugin.min"
import "tinymce/plugins/imagetools/plugin.min"
import "tinymce/plugins/insertdatetime/plugin.min"
import "tinymce/plugins/lists/plugin.min"
import "tinymce/plugins/advlist/plugin.min"
import "tinymce/plugins/nonbreaking/plugin.min"
import "tinymce/plugins/paste/plugin.min"
import "tinymce/plugins/searchreplace/plugin.min"
import "tinymce/plugins/table/plugin.min"
import "tinymce/plugins/textpattern/plugin.min"
import "tinymce/plugins/toc/plugin.min"
import "tinymce/plugins/wordcount/plugin.min"
import "tinymce/plugins/autoresize/plugin.min"

import Box from "@material-ui/core/Box";

import {useSelector} from "../../../redux/hooks";
import {editorSlice} from "../../../redux/editor/slice";

import './editor.css'

interface EditorProps {
  height: number,
  width: number | string
}

const APIKEY = 'b4fgyjjz40ibzvpid6x6i3qw7l29abb4nqwchtp5bkjfc677'
const IMAGE_UPLOAD_URL = 'http://127.0.0.1:8000/file/excel_upload/'

export const Editor: React.FC<EditorProps> = ({height, width}) => {
  const dispatch = useDispatch()
  const language = useSelector(s => s.language)

  const baseInitProps = {
    skin: 'oxide-dark',
    content_css: 'dark',
    content_style: `
        body { 
          background-color: rgba(0, 0, 0, 0.88) 
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
          border-radius: 5px;
        }

        ::-webkit-scrollbar-track-piece {
          background-color: #333;
          border-radius: 8px;
        }

        ::-webkit-scrollbar-thumb {
          background-color: #777;
          border-radius: 8px;
        }
        
        ::-webkit-scrollbar-corner {
          display: block;
        }
        .mce-content-body [contentEditable=false][data-mce-selected]{
          outline: 1px solid #eee !important;
        }
        `,
    language: language.lang === 'zh' ? 'zh_CN' : undefined,
    min_height: height,
    width: width,
  }
  const menubar = 'edit view insert format table help'
  const menu = {
    edit: {title: 'Edit', items: 'undo redo cut copy paste selectall searchreplace'},
    view: {title: 'View', items: 'visualaid fullscreen'},
    insert: {
      title: 'Insert',
      items: 'image link hr nonbreaking toc insertdatetime'
    },
    format: {
      title: 'Format',
      items: 'bold italic underline strikethrough superscript subscript lineheight'
    },
    table: {title: 'Table', items: 'inserttable | cell row column | tableprops deletetable'},
  }
  const codesample_languages = [{text: 'code', value: 'code'}]
  const plugins = [
    `autolink`, `link`, `codesample`, `directionality`, `emoticons`, `charmap`, `fullscreen`, `help`, `hr`, `image`,
    `imagetools`, `insertdatetime`, `lists`, `advlist`, `nonbreaking`, `paste`, `searchreplace`, `table`,
    `textpattern`, `toc`, `wordcount`, `autoresize`
  ]
  const toolbar = [
    // 'undo redo | removeformat | formatselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | outdent indent',
    // 'numlist bullist | codesample emoticons charmap | ltr rtl | fontselect | fontsizeselect',
    {name: 'history', items: ['undo', 'redo']},
    {name: 'clear', items: ['removeformat']},
    {name: 'formatselect', items: ['formatselect']},
    {name: 'font', items: ['forecolor', 'backcolor']},
    {name: 'align', items: ['alignleft', 'aligncenter', 'alignright', 'alignjustify']},
    {name: 'dent', items: ['outdent', 'indent']},

    {name: 'list', items: ['numlist', 'bullist']},
    {name: 'quote', items: ['codesample', 'emoticons', 'charmap']},
    {name: 'direction', items: ['ltr', 'rtl']},
    {name: 'fontselect', items: ['fontselect']},
    {name: 'fontsizeselect', items: ['fontsizeselect']},
  ]

  return <Box style={{marginTop: '20px'}}>
    <TinyMCEEditor
      apiKey={APIKEY}
      init={{
        ...baseInitProps,
        entity_encoding: 'numeric',
        menubar: menubar,
        menu: menu,
        codesample_languages: codesample_languages,
        help_tabs: ['shortcuts', 'versions'],
        nonbreaking_force_tab: true,
        paste_data_images: true,
        images_upload_url: IMAGE_UPLOAD_URL,
        textpattern_patterns: [
          {start: '---', replacement: '<hr/>'},
          {start: '--', replacement: '<br/>'},
          {start: '-', replacement: '—'},
          {start: '(c)', replacement: '©'},
        ],
        plugins: plugins,
        toolbar: toolbar,
      }}
      onEditorChange={(content, _) => {
        dispatch(editorSlice.actions.dispatchContent(content))
      }}
    />
  </Box>
}