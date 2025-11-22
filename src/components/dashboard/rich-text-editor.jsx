import React, {
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// Custom CSS for variable styling
const variableStyle = `
  .ql-editor .variable-tag {
    background-color: #dbeafe;
    color: #1e40af;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9em;
    font-weight: 500;
    display: inline-block;
    margin: 0 2px;
    cursor: default;
  }
`;

// Inject custom styles
if (typeof document !== 'undefined') {
  const styleId = 'quill-variable-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = variableStyle;
    document.head.appendChild(style);
  }
}

// Rich Text Editor component with Quill
const RichTextEditor = forwardRef(
  (
    {
      currentValue = '',
      setCurrentValue,
      placeholder = 'Enter text...',
      className = '',
      onReady,
    },
    ref
  ) => {
    const containerRef = useRef(null);
    const quillRef = useRef(null);
    const isUpdatingRef = useRef(false);

    // Default modules configuration
    const defaultModules = useMemo(
      () => ({
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'link', 'image'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
        ],
      }),
      []
    );

    // Initialize Quill only once
    useEffect(() => {
      if (!containerRef.current || quillRef.current) return;

      const container = containerRef.current;

      // Clear any existing content
      container.innerHTML = '';

      // Create editor container
      const editorContainer = container.ownerDocument.createElement('div');
      editorContainer.style.height = '200px';
      editorContainer.style.borderRadius = '0 0 6px 6px';
      container.appendChild(editorContainer);

      // Initialize Quill
      const quill = new Quill(editorContainer, {
        theme: 'snow',
        placeholder,
        modules: defaultModules,
      });

      quillRef.current = quill;

      // Set initial value if provided
      if (currentValue) {
        isUpdatingRef.current = true;
        // Process and style any existing variables in the content
        // Only wrap variables that aren't already wrapped
        let processedContent = currentValue;
        if (!currentValue.includes('class="variable-tag"')) {
          processedContent = currentValue.replace(
            /\{\{([^}]+)\}\}/g,
            '<span class="variable-tag">{{$1}}</span>'
          );
        }
        quill.clipboard.dangerouslyPasteHTML(processedContent);
        isUpdatingRef.current = false;
      }

      // Call onReady callback if provided
      if (onReady) {
        onReady(quill);
      }

      // Single event listener for text changes
      quill.on('text-change', () => {
        if (!isUpdatingRef.current) {
          const html = quill.root.innerHTML;
          setCurrentValue?.(html);
        }
      });

      // Cleanup function
      return () => {
        if (quillRef.current) {
          quillRef.current = null;
        }
        container.innerHTML = '';
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [placeholder, setCurrentValue, defaultModules, onReady]);

    // Don't update content on every currentValue change - it causes cursor issues
    // The editor manages its own state after initialization

    // Expose simple methods through ref
    useImperativeHandle(
      ref,
      () => ({
        getHTML: () => quillRef.current?.root.innerHTML || '',
        getText: () => quillRef.current?.getText() || '',
        focus: () => quillRef.current?.focus(),
        insertVariable: (variable) => {
          if (!quillRef.current) return;

          const quill = quillRef.current;
          const selection = quill.getSelection();
          const cursorPosition = selection
            ? selection.index
            : quill.getLength();

          const variableText = `{{${variable}}}`;

          // Insert plain text first
          quill.insertText(cursorPosition - 1, variableText, {
            color: '#1e40af',
          });

          // Move cursor after the inserted variable and reset formatting
          const newPosition = cursorPosition + variableText.length - 1;
          quill.setSelection(newPosition);

          // Reset text formatting for next input
          quill.format('color', false);
        },
        getQuillInstance: () => quillRef.current,
      }),
      []
    );

    return <div ref={containerRef} className={className} />;
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
