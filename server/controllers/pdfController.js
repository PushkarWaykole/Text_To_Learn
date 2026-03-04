import PDFDocument from 'pdfkit';
import Module from '../models/Module.js';
import User from '../models/User.js';
import Course from '../models/Course.js';

export const exportModuleToPDF = async (req, res, next) => {
    try {
        const { moduleId } = req.params;
        const auth0Id = req.auth?.payload?.sub;
        const user = await User.findOne({ auth0Id });

        if (!user) return res.status(404).json({ error: "User not found" });

        const moduleDoc = await Module.findById(moduleId).populate('course');
        if (!moduleDoc) return res.status(404).json({ error: "Module not found" });

        // Security check: Ensure user owns the course
        const course = await Course.findById(moduleDoc.course._id);
        if (!course || course.creator.toString() !== user._id.toString()) {
            return res.status(403).json({ error: "Access denied" });
        }

        // If PDF already generated and stored, served it
        if (moduleDoc.pdfData) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${moduleDoc.title.replace(/\s+/g, '_')}.pdf"`);
            return res.send(moduleDoc.pdfData);
        }

        // Generate new PDF from data
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', async () => {
            const result = Buffer.concat(chunks);

            // Save to DB as requested
            moduleDoc.pdfData = result;
            await moduleDoc.save();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${moduleDoc.title.replace(/\s+/g, '_')}.pdf"`);
            res.send(result);
        });

        // Header
        doc.fontSize(24).font('Helvetica-Bold').text(moduleDoc.title, { underline: true });
        doc.moveDown();
        doc.fontSize(12).font('Helvetica-Oblique').text(`Course: ${course.title}`, { color: '#666666' });
        doc.moveDown(2);

        // Content
        if (Array.isArray(moduleDoc.content)) {
            moduleDoc.content.forEach(block => {
                if (block.type === 'heading') {
                    doc.moveDown();
                    const size = block.level === 1 ? 20 : 16;
                    doc.fontSize(size).font('Helvetica-Bold').text(block.text);
                    doc.moveDown(0.5);
                } else if (block.type === 'paragraph') {
                    doc.fontSize(12).font('Helvetica').text(block.text, {
                        align: 'justify',
                        lineGap: 4
                    });
                    doc.moveDown();
                } else if (block.type === 'code') {
                    doc.moveDown(0.5);
                    doc.rect(doc.x - 5, doc.y, 500, 20).fill('#f0f0f0'); // background
                    doc.fillColor('black').fontSize(10).font('Courier').text(block.code, {
                        width: 480,
                        backgroundColor: '#f4f4f4'
                    });
                    doc.moveDown();
                }
                // Skip video and mcq as requested
            });
        }

        doc.end();

    } catch (err) {
        console.error("Backend PDF Gen error:", err);
        next(err);
    }
};
