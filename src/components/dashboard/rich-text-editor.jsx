import React, {
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// Rich Text Editor component with Quill
const RichTextEditor = forwardRef(
  (
    {
      currentValue = '',
      setCurrentValue,
      placeholder = 'Enter text...',
      className = '',
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
        quill.clipboard.dangerouslyPasteHTML(currentValue);
        isUpdatingRef.current = false;
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
    }, [currentValue, placeholder, setCurrentValue, defaultModules]);

    // Update content when currentValue changes externally
    useEffect(() => {
      if (
        quillRef.current &&
        currentValue !== quillRef.current.root.innerHTML
      ) {
        isUpdatingRef.current = true;
        const selection = quillRef.current.getSelection();
        quillRef.current.clipboard.dangerouslyPasteHTML(currentValue);
        // Restore selection if it existed
        if (selection) {
          quillRef.current.setSelection(selection);
        }
        isUpdatingRef.current = false;
      }
    }, [currentValue]);

    // Expose simple methods through ref
    useImperativeHandle(
      ref,
      () => ({
        getHTML: () => quillRef.current?.root.innerHTML || '',
        getText: () => quillRef.current?.getText() || '',
        focus: () => quillRef.current?.focus(),
      }),
      []
    );

    return <div ref={containerRef} className={className} />;
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
